import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { TextBold, TextMedium } from "../Text";
import { DANGER, DARK_GRAY, WHITE, SUCCESS } from "../../styles/colors";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { ButtonDefault } from "../Buttons/Default";
import styles2 from "./styles";

export const Article = ({ item, onEdit, onDestroy }) => {
  return (
    <View
      style={[
        styles.container,
        { justifyContent: "center", alignItems: "center" },
      ]}
    >
      <View style={styles.infosView}>
        <View style={styles.cartHeader}>
          <TextBold style={styles.clientName}>{item.profile_name}</TextBold>
          <View
            style={{
              backgroundColor: item.color.color_code,
              width: 20,
              height: 20,
              margin: 5,
            }}
          ></View>
          <TextBold style={styles.clientName}>{item.type.name}</TextBold>
        </View>
        <TextMedium style={styles.detailsText}>
          Qty: {item.qty} | Prix: {item.profile.price} DZD
        </TextMedium>
        <View style={styles2.buttons}>
          <ButtonDefault
            text="Edit"
            size="sm"
            color={SUCCESS}
            containerStyle={styles2.button}
            onPress={onEdit}
          />
          <ButtonDefault
            text="Delete"
            size="sm"
            color={DANGER}
            containerStyle={styles2.button}
            onPress={onDestroy}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#171717",
    shadowOffset: { width: -1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: 40,
    height: 40,
  },
  imageView: {
    width: 40,
  },
  infosView: {
    width: Dimensions.get("window").width - 140,
  },
  cartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  clientName: {
    fontSize: 16,
    marginRight: 10,
    marginBottom: 4,
  },
  detailsText: {
    color: DARK_GRAY,
  },
});
