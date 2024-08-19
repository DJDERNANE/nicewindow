import React, { Component } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import { Screen } from "../../../components/Containers/Screen";
import styles from "./styles";
import { ButtonSquare } from "../../../components/Buttons/Square";
import { BLACK, GRAY, PRIMARY, WHITE } from "../../../styles/colors";
import i18n from "../../../../i18n";

class AccountTypeSelectScreen extends Component {
  render() {
    return(
      <Screen>
        <LinearGradient 
          colors={[GRAY, WHITE]} 
          style={styles.container}
        >
          <ButtonSquare 
            icon={<Feather name="user" size={55} />}
            text={ i18n.t('auth.register.types.client') }
            style={[styles.button, {backgroundColor: GRAY}]}
            onPress={() => this.props.navigation.navigate('Register', {user_type: 1})}
          />

          <ButtonSquare 
            icon={<Entypo name="ruler" size={55} color={WHITE} />}
            text={ i18n.t('auth.register.types.carpentry') }
            textStyle={{color: WHITE}}
            style={[styles.button, {backgroundColor: BLACK}]}
            onPress={() => this.props.navigation.navigate('Register', {user_type: 2})}
          />

          <ButtonSquare 
            icon={<Feather name="truck" size={55} color={WHITE} />}
            text={ i18n.t('auth.register.types.supplier') }
            textStyle={{color: WHITE}}
            style={[styles.button, {backgroundColor: PRIMARY}]}
            onPress={() => this.props.navigation.navigate('Register', {user_type: 3})}
          />
          <ButtonSquare 
            icon={<Feather name="log-in" size={55} color={BLACK} />}
            text={ i18n.t('auth.login.title') }
            textStyle={{color: BLACK}}
            style={[styles.button, {backgroundColor: WHITE}]}
            onPress={() => this.props.navigation.navigate('Login')}
          />
        </LinearGradient>
      </Screen>
    );
  }
}

export default AccountTypeSelectScreen;