import React, { Component } from "react";
import { ScrollView, View } from "react-native";
import { ButtonDefault } from "../../../components/Buttons/Default";
import { Screen } from "../../../components/Containers/Screen";
import { Label } from "../../../components/Forms/Label";
import { PasswordInput } from "../../../components/Inputs/Password";
import styles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_LINK } from "../../../utils/constants";
import { DANGER, SUCCESS } from "../../../styles/colors";
import { DefaultAlert } from "../../../components/Alerts/Default";
import i18n from "../../../../i18n";

class SecuritySettingsScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      alertText: null,
      alertType: SUCCESS,

      current_password: null,
      new_password: null,
      new_password_confirmation: null
    }
  }

  handleChange(name, value) {
    this.setState({
      ...this.state,
      [name]: value
    })
  }

  async updatePassword() {
    this.setState({isLoading: true});
    const user = await AsyncStorage.getItem('user');

    fetch(API_LINK+'/account/password/update', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ JSON.parse(user).api_token
      },
      body: JSON.stringify({
        current_password: this.state.current_password,
        new_password: this.state.new_password,
        new_password_confirmation: this.state.new_password_confirmation
      })
    })
    .then((response) => response.json())
    .then((json) => {
      if(json.success)
      {
        this.setState({
          isLoading: false,
          alertText: 'Data successfuly updated.',
          alertType: SUCCESS,
          current_password: null,
          new_password: null,
          new_password_confirmation: null
        });
      }
      else
      {
        this.setState({
          isLoading: false,
          alertText: 'Something wrong',
          alertType: DANGER
        });
      }
    })
  }

  render() {
    const s = this.state;

    return(
      <Screen>
        {s.alertText &&
          <DefaultAlert type={s.alertType} alertClose={() => this.setState({alertText: null})}>{s.alertText}</DefaultAlert>
        }
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View style={styles.formGroup}>
              <Label required>{ i18n.t('settings.security.labels.current_password') }: </Label>
              <PasswordInput 
                value={s.current_password} 
                onChangeText={(value) => this.handleChange('current_password', value)} 
              />
            </View>
            <View style={styles.formGroup}>
              <Label required>{ i18n.t('settings.security.labels.new_password') }: </Label>
              <PasswordInput 
                value={s.new_password} 
                onChangeText={(value) => this.handleChange('new_password', value)} 
              />
            </View>
            <View style={styles.formGroup}>
              <Label required>{ i18n.t('settings.security.labels.new_password_confirmation') }: </Label>
              <PasswordInput 
                value={s.new_password_confirmation} 
                onChangeText={(value) => this.handleChange('new_password_confirmation', value)} 
              />
            </View>
            <View style={styles.formGroup}>
              <ButtonDefault 
                text={ i18n.t('settings.security.button') } 
                onPress={() => this.updatePassword()} 
                loading={s.isLoading}
              />
            </View>
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default SecuritySettingsScreen;