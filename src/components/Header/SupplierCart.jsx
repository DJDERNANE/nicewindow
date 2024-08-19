import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { TextMedium } from "../Text";
import { DANGER,WHITE } from "../../styles/colors";
import { useNavigation } from "@react-navigation/native";

export const SupplierCartHeader = ({ count, supplier }) => {
  const navigation = useNavigation();

  return(
    <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('SupplierCart', {supplier: supplier})}>
      <AntDesign name="shoppingcart" size={22} />
      <View style={styles.numberView}>
        <TextMedium style={styles.number}>{ count }</TextMedium>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {

  },
  numberView: {
    position: 'absolute',
    backgroundColor: DANGER,
    borderRadius: 10,
    right: -10,
    width: 16,
    alignItems: 'center'
  },
  number: {
    color: WHITE,
    padding: 3,
    fontSize: 12
  }
});