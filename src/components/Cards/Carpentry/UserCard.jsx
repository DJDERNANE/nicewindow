import React from "react";
import { Dimensions, Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import { TextBold, TextMedium } from "../../Text";
import { BLUE_SKY, DANGER, DARK_GRAY, SUCCESS, WARNING, WHITE } from "../../../styles/colors";
import { ButtonDefault } from "../../Buttons/Default";
import { Badge } from "../../Badges/Default";
import { useNavigation } from "@react-navigation/native";
import i18n from "../../../../i18n";

const UserCard = ({data, onStatusChanged}) => {
  const navigation = useNavigation();

  return(
    <View style={styles.container}>
      <View style={styles.header}>
        <TextBold style={styles.name}>{ data.firstname+' '+data.lastname }</TextBold>
        <Badge color={data.status === 'blocked' ? DANGER : SUCCESS}>{ data.status === 'blocked' ? i18n.t('status.users.blocked') : i18n.t('status.users.active') }</Badge>
      </View>
      <TextMedium style={styles.email}>{ data.email }</TextMedium>
      <TouchableOpacity onPress={() => Linking.openURL('tel:'+data.phone_number)}>
        <TextMedium style={styles.phone}>{ data.phone_number }</TextMedium>
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <ButtonDefault 
          text={ i18n.t('settings.users.buttons.edit') } 
          size={'md'} 
          containerStyle={styles.footerButton} 
          color={WARNING}
          onPress={() => navigation.navigate('EditUserSettings', {userData: data})}
        />

        {data.status === 'blocked' ?
          <ButtonDefault 
            text={ i18n.t('settings.users.buttons.activate') } 
            size={'md'} 
            color={SUCCESS} 
            containerStyle={styles.footerButton} 
            onPress={onStatusChanged}
          />
        :
          <ButtonDefault 
            text={ i18n.t('settings.users.buttons.block') } 
            size={'md'} 
            color={DANGER} 
            containerStyle={styles.footerButton} 
            onPress={onStatusChanged}
          />
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#171717',
    shadowOffset: {width: -1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  name: {
    fontSize: 20
  },
  email: {
    color: DARK_GRAY,
    fontSize: 16
  },
  phone: {
    color: BLUE_SKY,
    fontSize: 16
  },
  footer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerButton: {
    width: (Dimensions.get('screen').width/2)-40
  }
});

export default UserCard;