import React from "react";
import { BottomModalContainer } from "./BottomContainer";
import PropTypes from "prop-types";
import { Dimensions, StyleSheet, View } from "react-native";
import { ButtonDefault } from "../Buttons/Default";
import { DANGER, LIGHT, SUCCESS } from "../../styles/colors";
import { Label } from "../Forms/Label";
import { DefaultInput } from "../Inputs/default";
import { TextBold, TextMedium } from "../Text";

export const SendProfileOrderModal = (props) => {
  return(
    <BottomModalContainer isVisible={props.isVisible}>
      <View style={styles.body}>
        <View style={styles.formGroup}>
          <Label required>Qty: </Label>
          <DefaultInput 
            style={styles.input} 
            keyboardType={'number-pad'}
            onChangeText={props.onChageQty}
            value={props.qty}
          />
        </View>
        <View style={styles.formGroup}>
          <TextBold>
            Total:
            <TextMedium> {props.totalPrice} DZD</TextMedium>
          </TextBold>
        </View>
      </View>
      <View style={styles.footer}>
        <ButtonDefault 
          text={'Cancel'} 
          color={DANGER} 
          containerStyle={styles.footerButton} 
          onPress={props.onCancel}
        />

        <ButtonDefault 
          text={'Add'} 
          color={SUCCESS} 
          containerStyle={styles.footerButton} 
          onPress={props.onSend}
        />
      </View>
    </BottomModalContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    marginBottom: 22
  },
  formGroup: {
    marginBottom: 20
  },
  input: {
    backgroundColor: LIGHT
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerButton: {
    width: Dimensions.get('window').width/2-30
  }
});

SendProfileOrderModal.propTypes = {
  isVisible: PropTypes.bool,
  onCancel: PropTypes.func,
  onSend: PropTypes.func,
  onChageQty: PropTypes.func,
  qty: PropTypes.string,
  totalPrice: PropTypes.number
}