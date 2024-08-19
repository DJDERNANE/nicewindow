import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TextBold, TextMedium } from "../Text";
import { DANGER, DARK_GRAY, WHITE, WARNING } from "../../styles/colors";
import { Badge } from "../Badges/Default";
import { setOrderStatus } from "../../utils/helpers";
import { useNavigation } from "@react-navigation/native";
import { ButtonDefault } from "../Buttons/Default";
import AntDesign from 'react-native-vector-icons/AntDesign';
export const OrderCard = ({ id, client_name, status, price, date, display}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.container} onPress={() => display === 'carpentry' ? navigation.navigate('CRPNTRYProfileOrder', { order_id: id }) : navigation.navigate('PSOrder', { order_id: id })}>
      
      <View style={styles.clientNameView}>
        <TextBold style={styles.clientName}>{client_name}</TextBold>
        <Badge color={setOrderStatus(status).color}>{setOrderStatus(status).label}</Badge>
      </View>


      <TextMedium style={styles.detailsText}>
        {date.split('T')[0]} |
        Prix: {price} DZD
      </TextMedium>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#171717',
    shadowOffset: { width: -1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  },
  clientNameView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  clientName: {
    fontSize: 16,
    marginBottom: 4
  },
  detailsText: {
    color: DARK_GRAY
  }
});