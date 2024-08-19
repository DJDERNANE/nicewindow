import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, View } from "react-native";
import { DefaultInput } from "../../components/Inputs/default";
import { ButtonDefault } from "../../components/Buttons/Default";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_LINK } from "../../utils/constants";
import { DefaultAlert } from "../../components/Alerts/Default";
import { DANGER, GRAY, WHITE } from "../../styles/colors";
import styles from "./style";
import { TextExtraBold, TextMedium } from "../../components/Text";
import { Label } from "../../components/Forms/Label";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const ConfirmEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [alertText, setAlertText] = useState(null);
  const [otpCode, setOtpCode] = useState("");
  const navigation = useNavigation();
  const verify = async () => {
    const user = await AsyncStorage.getItem("user");
    setIsLoading(true);
    fetch(API_LINK + "/confirmemail", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(user).api_token}`,
      },
      body: JSON.stringify({
        otp_code: otpCode,
        token: JSON.parse(user).api_token,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          navigation.navigate("Home");
        } else {
          setAlertText("Wrong code");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {alertText && (
        <DefaultAlert type={DANGER} alertClose={() => setAlertText(null)} top>
          {alertText}
        </DefaultAlert>
      )}

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <LinearGradient colors={[GRAY, WHITE]} style={styles.container}>
          <TextExtraBold style={styles.title}>Check your email</TextExtraBold>
          <View style={styles.formGroup}>
            <Label style={styles.label}>Verification Code: </Label>
            <DefaultInput
              keyboardType={"numeric"}
              value={otpCode}
              onChangeText={(value) => setOtpCode(value)}
            />
          </View>
          <View>
            <ButtonDefault text={"Check"} onPress={verify} />
          </View>
        </LinearGradient>
      )}
    </ScrollView>
  );
};

export default ConfirmEmail;
