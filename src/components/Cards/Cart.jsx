import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { TextBold, TextMedium } from "../Text";
import { DANGER, DARK_GRAY, WHITE } from "../../styles/colors";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

export const CartCard = ({icon, client_name, price, profile_name, qty, onDelete}) => {
  return(
    <View style={styles.container}>
      <View style={styles.imageView}>
        <Image source={{uri: icon}} style={styles.image} />
      </View>
      <View style={styles.infosView}>
        <View style={styles.cartHeader}>
          <TextBold style={styles.clientName}>{client_name}</TextBold>
          <SimpleLineIcons name="ban" color={DANGER} onPress={onDelete} />
        </View>
        <TextMedium>{profile_name}</TextMedium>
        <TextMedium style={styles.detailsText}>
          Qty: {qty} |
          Prix: {price} DZD
        </TextMedium>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#171717',
    shadowOffset: {width: -1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  },
  image: {
    width: 40,
    height: 40
  },
  imageView: {
    width: 40
  },
  infosView: {
    width: Dimensions.get('window').width-140,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  clientName: {
    fontSize: 16,
    marginRight: 10,
    marginBottom: 4
  },
  detailsText: {
    color: DARK_GRAY
  }
});