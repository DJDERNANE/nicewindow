import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import React, { Component } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { DefaultAlert } from "../../../components/Alerts/Default";
import { ButtonDefault } from "../../../components/Buttons/Default";
import { Screen } from "../../../components/Containers/Screen";
import { Label } from "../../../components/Forms/Label";
import { DefaultInput } from "../../../components/Inputs/default";
import { PasswordInput } from "../../../components/Inputs/Password";
import { FullscreenLoading } from "../../../components/Loadings/Fullscreen";
import { TextMedium } from "../../../components/Text";
import { DANGER, GRAY, WHITE } from "../../../styles/colors";
import { API_LINK } from "../../../utils/constants";
import styles from "./styles";
import i18n from "../../../../i18n";

class RegisterScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      alertText: null,

      firstname: null,
      lastname: null,
      //email: null,
      phone_number: null,
      company_name: null,
      password: null
    }
  }

  handleChange(name, value) {
    this.setState({
      ...this.state,
      [name]: value
    })
  }

  register() {
    this.setState({isLoading: true});

    fetch(API_LINK+'/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        //email: this.state.email,
        phone_number: this.state.phone_number,
        company_name: this.state.company_name,
        password: this.state.password,
        type: this.props.route.params.user_type
      })
    })
    .then((response) => response.json())
    .then((json) => {
      if(json.success)
      {
        this.setState({isLoading: false});
        AsyncStorage.setItem('user', JSON.stringify(json.user));
        //this.props.navigation.navigate('ConfirmEmail');
        this.props.navigation.navigate('Home');
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
        <ScrollView keyboardShouldPersistTaps={'handled'} contentContainerStyle={{flexGrow: 1}} automaticallyAdjustKeyboardInsets>
          <LinearGradient
            colors={[GRAY, WHITE]} 
            style={styles.container}
          >
            <View style={styles.formGroup}>
              <Label style={styles.label} required>{ i18n.t('auth.register.labels.firstname') }: </Label>
              <DefaultInput value={s.firstname} onChangeText={(value) => this.handleChange('firstname', value)} />
            </View>
            <View style={styles.formGroup}>
              <Label style={styles.label} required>{ i18n.t('auth.register.labels.lastname') }: </Label>
              <DefaultInput value={s.lastname} onChangeText={(value) => this.handleChange('lastname', value)} />
            </View>
           { /*<View style={styles.formGroup}>
              <Label style={styles.label} required>{ i18n.t('auth.register.labels.email') }: </Label>
              <DefaultInput keyboardType={'email-address'} value={s.email} onChangeText={(value) => this.handleChange('email', value)} />
      </View>*/}
            <View style={styles.formGroup}>
              <Label style={styles.label} required>{ i18n.t('auth.register.labels.phone_number') }: </Label>
              <DefaultInput value={s.phone_number} onChangeText={(value) => this.handleChange('phone_number', value)} />
            </View>
            <View style={styles.formGroup}>
              <Label style={styles.label}>{ i18n.t('auth.register.labels.company_name') }: </Label>
              <DefaultInput value={s.company_name} onChangeText={(value) => this.handleChange('company_name', value)} />
            </View>
            <View style={styles.formGroup}>
              <Label style={styles.label} required>{ i18n.t('auth.register.labels.password') }: </Label>
              <PasswordInput value={s.password} onChangeText={(value) => this.handleChange('password', value)} />
            </View>
            <View>
              <ButtonDefault text={ i18n.t('auth.register.button') } onPress={() => this.register()} />
            </View>
            <View style={styles.footer}>
              <TouchableOpacity>
                <TextMedium style={styles.footerText}>
                  { i18n.t('auth.register.footer') }
                </TextMedium>
              </TouchableOpacity>
            </View>
            <View style={styles.footer}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                <TextMedium style={styles.registerText}>{ i18n.t('auth.login.title') }</TextMedium>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ScrollView>

        {s.isLoading &&
          <FullscreenLoading />
        }
      </Screen>
    );
  }
}

export default RegisterScreen;