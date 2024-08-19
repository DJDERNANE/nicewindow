import React, { Component } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
import { Screen } from "../../../components/Containers/Screen";
import { ButtonDefault } from "../../../components/Buttons/Default";
import styles from "./styles";
import { LocationCard } from "../../../components/Cards/Location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_LINK } from "../../../utils/constants";
import i18n from "../../../../i18n";

class LocationsSettingsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locationsData: null,
      locationsLoading: true
    }
  }

  componentDidMount() {
    this.getLocations();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getLocations();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  async getLocations() {
    const user = await AsyncStorage.getItem('user');

    fetch(API_LINK+'/locations', {
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
        locationsData: json.locations,
        locationsLoading: false
      });
    })
  }

  render() {
    const s = this.state;

    return(
      <Screen>
        <ScrollView 
          refreshControl={
            <RefreshControl 
              onRefresh={() => this.getLocations()}
              refreshing={s.locationsLoading}
            />
          }
        >
          <View style={styles.container}>
            <ButtonDefault 
              text={'+ '+ i18n.t('settings.locations.buttons.add')} 
              containerStyle={{marginBottom: 20}} 
              onPress={() => this.props.navigation.navigate('AddLocation')}
            />

            {s.locationsLoading ?
              <ActivityIndicator />
            :
              s.locationsData && s.locationsData.length > 0 &&
                s.locationsData.map((data, key) => {
                  return(
                    <LocationCard 
                      key={key}
                      data={data}
                      refresh={() => this.getLocations()}
                    />
                  );
                })
            }
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default LocationsSettingsScreen;