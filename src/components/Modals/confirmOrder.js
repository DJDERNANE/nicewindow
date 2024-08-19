import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  ScrollView,
} from "react-native";
import { WARNING, LIGHT, SUCCESS, DANGER } from "../../styles/colors";
import { ButtonDefault } from "../Buttons/Default";
import { Label } from "../Forms/Label";
import { DefaultInput } from "../Inputs/default";
import PropTypes from "prop-types";
import { BottomModalContainer } from "./BottomContainer";
import { useState } from "react";
import { TextBold } from "../Text";

export const ConfirmOrder = (props) => {
  return (
    <BottomModalContainer
      isVisible={props.isVisible}
      onBackdropPress={props.onCancel}
    >
      <View style={styles.orderItem}>
        <Text style={styles.title}>Confirm Payement : </Text>

        <View>
          <View style={styles.formGroup}>
            <Label required>Montant paye : </Label>
            <DefaultInput
              style={styles.input}
              keyboardType={"number-pad"}
              onChangeText={props.onChangePaye}
              value={String(props.paye)}
            />
          </View>
          <View>
            <Label required>Credit : </Label>
            <DefaultInput
              style={styles.input}
              keyboardType={"number-pad"}
              value={String(props.credit)}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <ButtonDefault
            text={"Cancel"}
            color={DANGER}
            containerStyle={styles.footerButton}
            onPress={props.onCancel}
          />

          <ButtonDefault
            text={"Save"}
            color={SUCCESS}
            containerStyle={styles.footerButton}
            onPress={props.onAdd}
          />
        </View>
      </View>
    </BottomModalContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  body: {
    marginBottom: 22,
  },
  formGroup: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: LIGHT,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerButton: {
    width: Dimensions.get("window").width / 2 - 30,
  },
  payment: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 20,
  },
});
