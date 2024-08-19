import React, { Component } from "react";
import { Screen } from "../../../components/Containers/Screen";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
import { ButtonDefault } from "../../../components/Buttons/Default";
import styles from "./styles";
import UserCard from "../../../components/Cards/Carpentry/UserCard";
import { DANGER, PRIMARY, SUCCESS } from "../../../styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CARPENTRY_API_LINK } from "../../../utils/constants";
import { DefaultAlert } from "../../../components/Alerts/Default";
import i18n from "../../../../i18n";

class UsersSettingsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      usersLoading: true,
      usersData: null,

      statusLoading: false,
      alertText: null,
      alertType: DANGER
    }
  }

  componentDidMount() {
    this.getUsers();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getUsers();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  async getUsers() {
    this.setState({usersLoading: true});
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK+'/users', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ JSON.parse(user).api_token
      }
    })
    .then((response) => response.json())
    .then((json) => {
      console.log(json)
      this.setState({
        usersData: json.users,
        usersLoading: false
      })
    })
  }

  async changeUserStatus(user_id) {
    this.setState({statusLoading: true});
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK+'/user/status/update', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ JSON.parse(user).api_token
      },
      body: JSON.stringify({
        user_id: user_id
      })
    })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      if(json.success)
      {
        this.setState({
          alertType: SUCCESS,
          alertText: 'Data successfuly updated.'
        }, () => {
          this.getUsers();
        });
      }
      else
      {
        this.setState({
          alertType: DANGER,
          alertText: json.message
        });
      }
      this.setState({
        statusLoading: false
      });
    })
  }

  render() {
    const s = this.state;

    return(
      <Screen>
        {s.alertText &&
          <DefaultAlert type={s.alertType} alertClose={() => this.setState({alertText: null})}>{s.alertText}</DefaultAlert>
        }
        <ScrollView 
          refreshControl={
            <RefreshControl 
              onRefresh={() => this.getUsers()}
              refreshing={s.usersLoading}
            />
          }
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <ButtonDefault 
                text={ '+ '+i18n.t('settings.users.buttons.add') } 
                onPress={() => this.props.navigation.navigate('AddUserSettings')} 
              />
            </View>
            <View>
              {s.usersLoading ?
                <ActivityIndicator size={'large'} color={PRIMARY} />
              :
                s.usersData && s.usersData.length > 0 &&
                  s.usersData.map((data, key) => {
                    return(
                      <UserCard 
                        data={data}
                        key={key}
                        onStatusChanged={() => this.changeUserStatus(data.id)}
                      />
                    );
                  })
              }
            </View>
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default UsersSettingsScreen;