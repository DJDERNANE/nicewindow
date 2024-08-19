import React, { Component } from "react";
import { Screen } from "../../../../components/Containers/Screen";
import { ScrollView, View } from "react-native";
import styles from "./styles";
import { DefaultInput } from "../../../../components/Inputs/default";
import { Label } from "../../../../components/Forms/Label";
import { ButtonDefault } from "../../../../components/Buttons/Default";
import { PasswordInput } from "../../../../components/Inputs/Password";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CARPENTRY_API_LINK } from "../../../../utils/constants";
import { DefaultAlert } from "../../../../components/Alerts/Default";
import { DANGER } from "../../../../styles/colors";
import { TextMedium } from "../../../../components/Text";
import i18n from "../../../../../i18n";

class AddUserScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      alertText: null,

      firstname: null,
      lastname: null,
      email: null,
      password: null,
      phone_number: null
    }
  }

  handleChange(name, value) {
    this.setState({
      ...this.state,
      [name]: value
    })
  }

  async store() {
    this.setState({isLoading: true});
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK+'/user/store', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ JSON.parse(user).api_token
      },
      body: JSON.stringify({
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        phone_number: this.state.phone_number,
        email: this.state.email,
        password: this.state.password
      })
    })
    .then((response) => response.json())
    .then((json) => {
      if(json.success)
      {
        this.setState({isLoading: false});
        this.props.navigation.navigate('UsersSettings');
      }
      else
      {
        this.setState({
          isLoading: false,
          alertText: json.message
        });
      }
    })
  }

  render() {
    const s = this.state;

    return(
      <Screen>
        {s.alertText &&
          <DefaultAlert 
            type={DANGER} 
            alertClose={() => this.setState({alertText: null})}
          >
            {s.alertText}
          </DefaultAlert>
        }
        <ScrollView keyboardShouldPersistTaps={'always'}>
          <View style={styles.container}>
            <View style={styles.formGroup}>
              <TextMedium style={styles.description}>
                { i18n.t('settings.users.add_description') } 
              </TextMedium>
            </View>
            <View style={styles.formGroup}>
              <Label required>{ i18n.t('settings.users.labels.firstname') }: </Label>
              <DefaultInput 
                onChangeText={(value) => this.handleChange('firstname', value)} 
                value={s.firstname} 
              />
            </View>

            <View style={styles.formGroup}>
              <Label required>{ i18n.t('settings.users.labels.lastname') }: </Label>
              <DefaultInput 
                onChangeText={(value) => this.handleChange('lastname', value)} 
                value={s.lastname} 
              />
            </View>

            <View style={styles.formGroup}>
              <Label required>{ i18n.t('settings.users.labels.phone_number') }: </Label>
              <DefaultInput 
                onChangeText={(value) => this.handleChange('phone_number', value)} 
                value={s.phone_number} 
              />
            </View>

            <View style={styles.formGroup}>
              <Label required>{ i18n.t('settings.users.labels.email') }: </Label>
              <DefaultInput 
                onChangeText={(value) => this.handleChange('email', value)} 
                value={s.email} 
              />
            </View>

            <View style={styles.formGroup}>
              <Label required>{ i18n.t('settings.users.labels.password') }: </Label>
              <PasswordInput
                onChangeText={(value) => this.handleChange('password', value)} 
                value={s.password} 
              />
            </View>

            <View style={styles.formGroup}>
              <ButtonDefault 
                text={ i18n.t('settings.users.buttons.save') }
                onPress={() => this.store()} 
              />
            </View>
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default AddUserScreen;