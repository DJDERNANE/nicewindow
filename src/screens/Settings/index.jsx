import React, { Component, Fragment } from "react";
import { BackHandler, DeviceEventEmitter, NativeModules, ScrollView, TouchableOpacity, View } from "react-native";
import Entypo from 'react-native-vector-icons/Entypo'
import Octicons from 'react-native-vector-icons/Octicons'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { Screen } from "../../components/Containers/Screen";
import { TextMedium } from "../../components/Text";
import styles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../../../i18n";

class SettingsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      userLoaded: false
    }
  }

  componentDidMount() {
    this.setUserData();
  }

  async setUserData() {
    this.setState({
      user: await AsyncStorage.getItem('user'),
      userLoaded: true
    });
  }

  render() {
    const p = this.props;
    const s = this.state;
    const { t } = i18n;

    if(!s.userLoaded)
    {
      return <View></View>
    }

    return(
      <Screen>
        <ScrollView>
          <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => p.navigation.navigate('GeneralSettings')}>
              <Entypo name="cog" size={18} />
              <TextMedium style={styles.buttonText}>
                { t('settings.general.title') }
              </TextMedium>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => p.navigation.navigate('SecuritySettings')}>
              <Octicons name="lock" size={18} />
              <TextMedium style={styles.buttonText}>
                { t('settings.security.title') }
              </TextMedium>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => p.navigation.navigate('LanguagesSettings')}>
              <MaterialIcons name="translate" size={18} />
              <TextMedium style={styles.buttonText}>
                { t('settings.languages.title') }
              </TextMedium>
            </TouchableOpacity>

            {
              <TouchableOpacity style={styles.button} onPress={() => p.navigation.navigate('SubscribtionsSettings')}>
                <FontAwesome5 name="money-check" size={16} />
                <TextMedium style={styles.buttonText}>
                  { t('settings.subscribtions.title') }
                </TextMedium>
              </TouchableOpacity>
            }
            {
              (Number(JSON.parse(s.user).type) === 3)  &&
              <TouchableOpacity style={styles.button} onPress={() => p.navigation.navigate('LocationsSettings')}>
              <Entypo name="map" size={16} />
              <TextMedium style={styles.buttonText}>
                { t('settings.locations.title') }
              </TextMedium>
            </TouchableOpacity>

            
            }
            {(Number(JSON.parse(s.user).type) === 2 && !JSON.parse(s.user).master_id )&&
              <Fragment>
                <TouchableOpacity style={styles.button} onPress={() => p.navigation.navigate('LocationsSettings')}>
                  <Entypo name="map" size={16} />
                  <TextMedium style={styles.buttonText}>
                    { t('settings.locations.title') }
                  </TextMedium>
                </TouchableOpacity>
                
                <TouchableOpacity
                style={styles.button}
                onPress={() => p.navigation.navigate("PricesSettings")}
              >
                <Feather name="dollar-sign" size={18} />
                <TextMedium style={styles.buttonText}>
                  {t("settings.prices")}
                </TextMedium>
              </TouchableOpacity>
                
                <TouchableOpacity style={styles.button} onPress={() => p.navigation.navigate('UsersSettings')}>
                  <Octicons name="people" size={18} />
                  <TextMedium style={styles.buttonText}>
                    { t('settings.users.title') }
                  </TextMedium>
                </TouchableOpacity>
              </Fragment>
            }
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default SettingsScreen;