import React from "react";
import { StyleSheet, View } from "react-native";
import { ButtonDefault } from "../Buttons/Default";
import { TextBold } from "../Text";

const QtyCounter = ({ value, onChange}) => {
  return(
    <View style={styles.container}>
      <ButtonDefault text={'-'} onPress={() => onChange('-')} />
      <TextBold style={styles.text}>{ value }</TextBold>
      <ButtonDefault text={'+'} onPress={() => onChange('+')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 6
  },
  text: {
    fontSize: 20
  }
});

export default QtyCounter;