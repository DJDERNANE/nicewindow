import React from "react";
import { Dimensions, Linking, StyleSheet, View } from "react-native";
import PropTypes from 'prop-types';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import { TextBold, TextMedium } from "../Text";
import { Badge } from "../Badges/Default";
import { DANGER, DARK_GRAY, INFO, SUCCESS, WHITE } from "../../styles/colors";
import { setAppointmentStatus } from "../../utils/helpers";
import { ButtonDefault } from "../Buttons/Default";
import i18n from "../../../i18n";

export const AppointmentCard = (props) => {
  return(
    <View style={styles.container}>
      <View style={styles.userInfosView}>
        <TextBold style={styles.userFullnameText}>{props.data.client_name}</TextBold>
        <Badge color={ setAppointmentStatus(props.data.status).color }>{ setAppointmentStatus(props.data.status).label }</Badge>
      </View>
      <View style={styles.labelView}>
        <TextMedium>{props.data.label}</TextMedium>
      </View>
      <View style={styles.infosView}>
        <TextMedium style={styles.dateText}>{props.data.date} | {props.data.time}</TextMedium>
      </View>
      <View style={styles.buttonsView}>
        <ButtonDefault 
          size={'sm'}
          color={INFO} 
          containerStyle={styles.buttonCall} 
          icon={<Feather name="phone-call" size={16} />}
          onPress={() => Linking.openURL('tel:'+props.data.client_mobile)}
        />

        <ButtonDefault 
          size={'sm'}
          color={SUCCESS} 
          text={ i18n.t('appointments.buttons.finish') } 
          containerStyle={styles.buttonFinish} 
          icon={<Feather name="check" size={14} />}
          onPress={props.onFinish}
        />

        <ButtonDefault 
          size={'sm'}
          color={DANGER} 
          text={ i18n.t('appointments.buttons.delete') } 
          containerStyle={styles.buttonDelete} 
          icon={<SimpleLineIcons name="trash" size={12} />}
          onPress={props.onDelete}
        />
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
  userInfosView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  userFullnameText: {
    fontSize: 20
  },
  labelView: {
    marginVertical: 5
  },
  dateText: {
    color: DARK_GRAY
  },
  infosView: {
    marginBottom: 16
  },
  buttonsView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonCall: {
    width: Dimensions.get('window').width/3-70
  },
  buttonFinish: {
    width: Dimensions.get('window').width/3-10
  },
  buttonDelete: {
    width: Dimensions.get('window').width/3-10
  }
});

AppointmentCard.propTypes = {
  data: PropTypes.object,
  onDelete: PropTypes.func,
  onFinish: PropTypes.func
}