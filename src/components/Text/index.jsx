import React from "react";
import { Text, View } from "react-native";
import {
  useFonts as useMontserratFont,
  Montserrat_300Light,
  Montserrat_500Medium,
  Montserrat_700Bold,
  Montserrat_900Black,
} from "@expo-google-fonts/montserrat";
import {
  useFonts as useChangaFont,
  Changa_300Light,
  Changa_500Medium,
  Changa_700Bold,
  Changa_800ExtraBold,
} from "@expo-google-fonts/changa";
import i18n from "../../../i18n";

export const TextLight = (props) => {
  const { language } = i18n;

  let [fontsLoaded] =
    language === "ar"
      ? useChangaFont({ Changa_300Light })
      : useMontserratFont({ Montserrat_300Light });

  if (!fontsLoaded) {
    return <View></View>;
  } else {
    return (
      <Text
        style={[
          {
            fontFamily:
              language === "ar" ? "Changa_300Light" : "Montserrat_300Light",
          },
          props.style,
        ]}
      >
        {props.children}
      </Text>
    );
  }
};

export const TextMedium = (props) => {
  const { language } = i18n;

  let [fontsLoaded] =
    language === "ar"
      ? useChangaFont({ Changa_500Medium })
      : useMontserratFont({ Montserrat_500Medium });

  if (!fontsLoaded) {
    return <View></View>;
  } else {
    return (
      <Text
        style={[
          {
            fontFamily:
              language === "ar" ? "Changa_500Medium" : "Montserrat_500Medium",
          },
          props.style,
        ]}
      >
        {props.children}
      </Text>
    );
  }
};

export const TextBold = (props) => {
  const { language } = i18n;

  let [fontsLoaded] =
    language === "ar"
      ? useChangaFont({ Changa_700Bold })
      : useMontserratFont({ Montserrat_700Bold });

  if (!fontsLoaded) {
    return <View></View>;
  } else {
    return (
      <Text
        style={[
          {
            fontFamily:
              language === "ar" ? "Changa_700Bold" : "Montserrat_700Bold",
          },
          props.style,
        ]}
      >
        {props.children}
      </Text>
    );
  }
};

export const TextExtraBold = (props) => {
  const { language } = i18n;

  let [fontsLoaded] =
    language === "ar"
      ? useChangaFont({ Changa_800ExtraBold })
      : useMontserratFont({ Montserrat_900Black });

  if (!fontsLoaded) {
    return <View></View>;
  } else {
    return (
      <Text
        style={[
          {
            fontFamily:
              language === "ar" ? "Changa_800ExtraBold" : "Montserrat_900Black",
          },
          props.style,
        ]}
      >
        {props.children}
      </Text>
    );
  }
};
