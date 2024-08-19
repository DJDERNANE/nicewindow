import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { TextBold, TextMedium } from "../../components/Text";
import { CarpentryHomeScreen } from "./Carpentry";
import { ClientHomeScreen } from "./Client";
import { SupplierHomeScreen } from "./Supplier";
import i18n from "../../../i18n";
import { API_LINK } from "../../utils/constants";
import EndSub from "./EndSubscribtion";
import ConfirmEmail from "../ConfirmEmail";

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [sub, setSub] = useState(null);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [worker, setWorker] = useState(false);

  useEffect(() => {
    setUserData();
    checkSubscription();
  }, []);

  const setHeaderTitle = () => {
    navigation.setOptions({
      headerTitle: () => (
        <TextBold style={{ fontSize: 18 }}>
          {i18n.t("home.title")} {user ? JSON.parse(user).firstname : ""}
        </TextBold>
      ),
    });
  };

  const setUserData = async () => {
    const userData = await AsyncStorage.getItem("user");
    setUser(userData);
    setUserLoaded(true);
    setHeaderTitle();
  };

  const checkSubscription = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (!userData) {
        throw new Error("User data not found in AsyncStorage");
      }

      const formData = new FormData();
      formData.append("token", JSON.parse(userData).api_token);

      const response = await fetch(API_LINK + "/login/check", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + JSON.parse(userData).api_token,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch subscription status");
      }

      const json = await response.json();
      setSub(json.sub);
      setVerifyEmail(json.verify_email);
      setWorker(json.worker);
      // Update component state or perform other actions based on the response
    } catch (error) {
      console.error("Error while checking subscription:", error);
      // Handle errors, e.g., display an error message to the user
    }
  };

  if (!userLoaded) {
    return <View />;
  }
  if (verifyEmail == false) {
    return <ConfirmEmail />;
  } else {
    if (sub === 1) {
      if (Number(JSON.parse(user).type) === 1) {
        return <ClientHomeScreen />;
      } else if (Number(JSON.parse(user).type) === 2) {
        return <CarpentryHomeScreen user={JSON.parse(user)} />;
      } else if (Number(JSON.parse(user).type) === 3) {
        return <SupplierHomeScreen />;
      }
    } else {
      return <EndSub />;
    }
  }

  return (
    <TextMedium>
      Something wrong. Please contact us to fix this problem.
    </TextMedium>
  );
};

export default HomeScreen;
