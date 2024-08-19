import React, { Component } from "react";
import { Screen } from "../../../components/Containers/Screen";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { RepairCarpentryCard } from "../../../components/Cards/RepairCarpentry";
import styles from "./styles";
import { PRIMARY } from "../../../styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';
import { CLIENT_API_LINK } from "../../../utils/constants";
import { TextMedium } from "../../../components/Text";

class RepairScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      carpentriesData: null,
      carpentriesLoading: true,

      locationPermissionGranted: false,
      latitude: null,
      longitude: null
    }
  }

  componentDidMount() {
    this.getLocation();
  }

  async getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    
    this.setState({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      locationPermissionGranted: true
    });

    this.getCarpentries();
  }

  async getCarpentries() {
    const user = await AsyncStorage.getItem('user');

    fetch(CLIENT_API_LINK+'/repair', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ JSON.parse(user).api_token
      },
      body: JSON.stringify({
        latitude: this.state.latitude,
        longitude: this.state.longitude
      })
    })
    .then((response) => response.json())
    .then((json) => {
      this.setState({
        carpentriesData: json.carpentries,
        carpentriesLoading: false
      });
    })
  }

  render() {
    const s = this.state;

    return(
      <Screen>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.container}>
            {s.carpentriesLoading ?
              <ActivityIndicator size={'large'} color={PRIMARY} />
            :
              s.carpentriesData && s.carpentriesData.length > 0 ?
                s.carpentriesData.map((data, key) => {
                  return(
                    <RepairCarpentryCard 
                      key={key}
                      name={data.user.firstname+' '+data.user.lastname}
                      mobile_number={data.user.phone_number}
                      address={data.address}
                      distance={data.distance+' KM'}
                    />
                  );
                })
              :
                <TextMedium>There are no result.</TextMedium>
            }
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default RepairScreen;