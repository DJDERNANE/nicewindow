import { LinearGradient } from "expo-linear-gradient";
import React, { Component } from "react";
import { TouchableOpacity, View } from "react-native";
import { ButtonDefault } from "../../../components/Buttons/Default";
import { Screen } from "../../../components/Containers/Screen";
import { Label } from "../../../components/Forms/Label";
import { DefaultInput } from "../../../components/Inputs/default";
import { TextExtraBold, TextMedium } from "../../../components/Text";
import { GRAY, WHITE } from "../../../styles/colors";
import styles from "../Login/styles";
import i18n from "../../../../i18n";

class PasswordRecoveryScreen extends Component {
  render() {
    return(
      <Screen>
        <LinearGradient
          colors={[GRAY, WHITE]} 
          style={styles.container}
        >
          <TextExtraBold style={styles.title}>{ i18n.t('auth.password_recovery.title') }</TextExtraBold>
          <TextMedium style={styles.description}>{ i18n.t('auth.password_recovery.description') }</TextMedium>
          <View style={styles.formGroup}>
            <Label>{ i18n.t('auth.password_recovery.labels.email') }: </Label>
            <DefaultInput keyboardType="email-address" />
          </View>
          <View style={styles.formGroup}>
            <ButtonDefault text={ i18n.t('auth.password_recovery.button') } />
          </View>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
            <TextMedium style={styles.passwordRecoveryText}>{ i18n.t('auth.password_recovery.back') }</TextMedium>
          </TouchableOpacity>
        </LinearGradient>
      </Screen>
    );
  }
}

export default PasswordRecoveryScreen;