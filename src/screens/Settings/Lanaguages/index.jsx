import React, { Component } from "react";
import Feather from 'react-native-vector-icons/Feather';
import { Screen } from "../../../components/Containers/Screen";
import { NativeModules, TouchableOpacity, View } from "react-native";
import { TextBold } from "../../../components/Text";
import styles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../../../../i18n";

class LanguagesSettingsScreen extends Component {
  constructor(props) {
    super(props);
  }

  async changeLanguageHandler(lang) {
    await AsyncStorage.setItem('lang', lang);
    NativeModules.DevSettings.reload();
  }

  render() {
    return(
      <Screen>
        <View style={styles.container}>
          <TouchableOpacity style={styles.langSelectView} onPress={() => this.changeLanguageHandler('en')}>
            <TextBold style={styles.langSelectText}>English</TextBold>
            {i18n.language === 'en' &&
              <Feather name="check" size={18} />
            }
          </TouchableOpacity>
          <TouchableOpacity style={styles.langSelectView} onPress={() => this.changeLanguageHandler('ar')}>
            <TextBold style={styles.langSelectText}>عربية</TextBold>
            {i18n.language === 'ar' &&
              <Feather name="check" size={18} />
            }
          </TouchableOpacity>
          <TouchableOpacity style={styles.langSelectView} onPress={() => this.changeLanguageHandler('fr')}>
            <TextBold style={styles.langSelectText}>Français</TextBold>
            {i18n.language === 'fr' &&
              <Feather name="check" size={18} />
            }
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }
}

export default LanguagesSettingsScreen;