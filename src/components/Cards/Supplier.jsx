import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TextBold, TextMedium } from "../Text";
import { DARK_GRAY, WHITE } from "../../styles/colors";
import { useNavigation } from "@react-navigation/native";
import PropTypes from "prop-types";

import { ProfilePicturePicker } from "../FilesPicker/ProfilePicture";
import { MAIN_LINK } from "../../utils/constants";

export const SupplierCard = (props) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate("SupplierProfile", { data: props.data })
      }
    >
      <View style={{ marginRight: 10 }}>
        <ProfilePicturePicker
          style={{ width: 10 }}
          image={props.data.logo ? MAIN_LINK + props.data.logo : ""}
        />
      </View>
      <View style={{ flexDirection: "column" }}>
        <TextBold style={styles.nameText}>
          {props.data.firstname + " " + props.data.lastname}
        </TextBold>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#171717",
    shadowOffset: { width: -1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  nameText: {
    fontSize: 18,
  },
  addressText: {
    color: DARK_GRAY,
  },
});

SupplierCard.propTypes = {
  data: PropTypes.object,
};
