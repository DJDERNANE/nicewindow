import React from "react";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import { TextBold, TextMedium } from "../Text";
import { DARK_GRAY, PRIMARY, WHITE } from "../../styles/colors";
import PropTypes from "prop-types";

export const RepairCarpentryCard = (props) => {
  return(
    <View style={styles.container}>
      <View>
        <TextBold style={styles.nameText}>{props.name}</TextBold>
        <TextMedium>{props.mobile_number}</TextMedium>
        <TextMedium style={styles.addressText}>{props.address} ({props.distance})</TextMedium>
      </View>
      <TouchableOpacity style={styles.callButton} onPress={() => Linking.openURL('tel:'+props.mobile_number)}>
        <Feather name="phone-call" size={20} color={WHITE} style={styles.callIcon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    padding: 14,
    marginBottom: 20,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  nameText: {
    fontSize: 20
  },
  addressText: {
    color: DARK_GRAY,
    marginTop: 4
  },
  callButton: {
    backgroundColor: PRIMARY,
    padding: 3,
    padding: 10,
    borderRadius: 50
  },
  callIcon: {

  }
});

RepairCarpentryCard.propTypes = {
  name: PropTypes.string,
  mobile_number: PropTypes.string,
  address: PropTypes.string,
  distance: PropTypes.string
}