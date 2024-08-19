import React, { Component } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Screen } from "../../../components/Containers/Screen";
import styles from "./styles";
import { TextExtraBold, TextMedium } from "../../../components/Text";
import { Label } from "../../../components/Forms/Label";
import { I18nManager, Image, ScrollView, TouchableOpacity, View } from "react-native";
import { DefaultInput } from "../../../components/Inputs/default";
import { ButtonDefault } from "../../../components/Buttons/Default";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_LINK } from "../../../utils/constants";
import { DefaultAlert } from "../../../components/Alerts/Default";
import { DANGER, GRAY, WHITE } from "../../../styles/colors";
import { FullscreenLoading } from "../../../components/Loadings/Fullscreen";
import { PasswordInput } from "../../../components/Inputs/Password";
import i18n from "../../../../i18n";

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      alertText: null,
      //email: null,
      phone_number: null,
      password: null
    }
  }

  componentDidMount() {
    this.checkLogin();
  }

  handleChange(name, value) {
    this.setState({
      ...this.state,
      [name]: value
    })
  }

  login() {
    this.setState({ isLoading: true });

    fetch(API_LINK + '/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        //email: this.state.email,
        phone_number: this.state.phone_number,
        password: this.state.password
      })
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          this.setState({ isLoading: false });
          AsyncStorage.setItem('user', JSON.stringify(json.user));
          this.props.navigation.navigate('Home');
        }
        else {
          this.setState({
            isLoading: false,
            alertText: json.message
          });
        }
      })
  }

  async checkLogin() {
    let user = await AsyncStorage.getItem('user');

    if (user !== null) {
      fetch(API_LINK + '/login/check', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: JSON.parse(user).api_token
        })
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.success) {
            this.props.navigation.navigate('Home');
          }
          this.setState({ isLoading: false });
        })
    }
    else {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const s = this.state;

    if (s.isLoading) {
      return (
        <FullscreenLoading />
      );
    }

    return (
      <Screen>
        {s.alertText &&
          <DefaultAlert
            type={DANGER}
            alertClose={() => this.setState({ alertText: null })}
            top
          >
            {s.alertText}
          </DefaultAlert>
        }
        <ScrollView automaticallyAdjustKeyboardInsets contentContainerStyle={{ flexGrow: 1 }}>
          <LinearGradient
            colors={[GRAY, WHITE]}
            style={styles.container}
          >
            <View style={styles.logoView}>
              <Image source={require('../../../../assets/icon.png')} style={styles.logo} />
            </View>
            <TextExtraBold style={styles.title}>{i18n.t('auth.login.title')}</TextExtraBold>
            <TextMedium style={styles.description}>{i18n.t('auth.login.description')}</TextMedium>
            {/*<View style={styles.formGroup}>
              <Label style={styles.label}>{ i18n.t('auth.login.labels.email') }: </Label>
              <DefaultInput keyboardType={'email-address'} value={s.email} onChangeText={(value) => this.handleChange('email', value)} />
      </View>*/}
            <View style={styles.formGroup}>
              <Label style={styles.label} required>{i18n.t('auth.register.labels.phone_number')}: </Label>
              <DefaultInput value={s.phone_number} onChangeText={(value) => this.handleChange('phone_number', value)} />
            </View>
            <View style={styles.formGroup}>
              <Label style={styles.label}>{i18n.t('auth.login.labels.password')}: </Label>
              <PasswordInput value={s.password} onChangeText={(value) => this.handleChange('password', value)} />
            </View>
            <View style={styles.formGroup}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('PasswordRecovery')}>
                <TextMedium style={styles.passwordRecoveryText}>{i18n.t('auth.login.password_recovery')}</TextMedium>
              </TouchableOpacity>
            </View>
            <View>
              <ButtonDefault text={i18n.t('auth.login.button')} onPress={() => this.login()} />
            </View>
            <View style={styles.footer}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('RegisterAccountType')}>
                <TextMedium style={styles.registerText}>{i18n.t('auth.login.register_description')}</TextMedium>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ScrollView>
      </Screen>
    );
  }
}

export default LoginScreen;