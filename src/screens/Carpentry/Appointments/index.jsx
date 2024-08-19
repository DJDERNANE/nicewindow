import React, { Component } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
import { Screen } from "../../../components/Containers/Screen";
import { AppointmentCard } from "../../../components/Cards/Appointments";
import styles from "./styles";
import { ButtonDefault } from "../../../components/Buttons/Default";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CARPENTRY_API_LINK } from "../../../utils/constants";
import i18n from "../../../../i18n";

class AppointmentsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appointmentsLoading: true,
      appointmentsData: null
    }
  }

  componentDidMount() {
    this.getAppointments();
  }

  async getAppointments() {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK+'/appointments', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ JSON.parse(user).api_token
      }
    })
    .then((response) => response.json())
    .then((json) => {
      this.setState({
        appointmentsData: json.appointments,
        appointmentsLoading: false
      });
    })
  }

  async destroy(id) {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK+'/appointment/destroy', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ JSON.parse(user).api_token
      },
      body: JSON.stringify({
        id: id
      })
    })
    .then((response) => response.json())
    .then((json) => {
      if(json.success)
      {
        this.getAppointments();
      }
    })
  }

  async finish(id) {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK+'/appointment/finish', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ JSON.parse(user).api_token
      },
      body: JSON.stringify({
        id: id
      })
    })
    .then((response) => response.json())
    .then((json) => {
      if(json.success)
      {
        this.getAppointments();
      }
    })
  }

  render() {
    const s = this.state;

    return (
      <Screen>
        <ScrollView 
          refreshControl={
            <RefreshControl 
              onRefresh={() => this.getAppointments()}
              refreshing={s.appointmentsLoading}
            />
          }
          contentContainerStyle={{flexGrow: 1}}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <ButtonDefault 
                text={ '+ '+i18n.t('appointments.buttons.add_appointment') } 
                onPress={() => this.props.navigation.navigate('AddAppointment')} 
              />
            </View>
            <View>
              <View>
                {s.appointmentsLoading ?
                  <ActivityIndicator />
                :
                s.appointmentsData && s.appointmentsData.length > 0 ?
                  s.appointmentsData.map((data, key) => {
                    return(
                      <AppointmentCard 
                        key={key}
                        data={data}
                        onDelete={() => this.destroy(data.id)}
                        onFinish={() => this.finish(data.id)}
                      />
                    );
                  })
                :
                  <View></View>
                }
              </View>
            </View>
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default AppointmentsScreen;