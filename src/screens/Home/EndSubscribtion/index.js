import React from "react";
import { TouchableOpacity, View, Linking } from "react-native";
import { Text, Button } from "react-native-elements";
import { BLACK } from "../../../styles/colors";
import { TextBold } from "../../../components/Text";
import Feather from "react-native-vector-icons/Feather";
import { ButtonDefault } from "../../../components/Buttons/Default";
import { useNavigation } from "@react-navigation/native"; // Import the useNavigation hook

const WhatsAppButton = () => {
  const openWhatsApp = () => {
    const phoneNumber = "+213698764880"; // Enter the phone number you want to message

    const whatsappURL = `whatsapp://send?phone=${phoneNumber}`;

    Linking.openURL(whatsappURL).catch((error) => {
      console.error("Failed to open WhatsApp:", error);
    });
  };

  return (
    <TouchableOpacity
      onPress={openWhatsApp}
      style={{ flexDirection: "row", alignItems: "center" }}
    >
      <Feather name="message-circle" size={22} color={BLACK} />
      <Text style={{ marginLeft: 5 }}>WhatsApp</Text>
    </TouchableOpacity>
  );
};

const EndSub = () => {
  const navigation = useNavigation(); // Access navigation using the useNavigation hook

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TextBold>Your subscription has expired!</TextBold>
      <TextBold>Contact us to get a new subscription.</TextBold>
      <View
        style={{
          marginVertical: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Button
          icon={<Feather name="phone-call" size={22} />}
          title="Call Us"
          onPress={() => Linking.openURL("tel:0662167266")}
        />
        <WhatsAppButton />
      </View>
      <View>
        <ButtonDefault
          text="Logout"
          onPress={() => navigation.navigate("Logout")} // Use navigation directly
        />
      </View>
    </View>
  );
};

export default EndSub;
