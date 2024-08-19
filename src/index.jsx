import React, { Component } from "react";
import AppNavigator from "./navigations/app-navigator";
import { I18nManager } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../i18n";

class MyApp extends Component {
    componentDidMount() {
        this.checkLanguage();
    }

    async checkLanguage() {
        const lang = await AsyncStorage.getItem("lang");
        if (lang && lang === "en") {
            i18n.changeLanguage("en");
        } else if (lang && lang === "fr") {
            i18n.changeLanguage("fr");
        } else {
            i18n.changeLanguage("ar");
        }

        if (lang && lang === "ar") {
            I18nManager.allowRTL(true);
            I18nManager.forceRTL(true);
        } else {
            I18nManager.allowRTL(false);
            I18nManager.forceRTL(false);
        }
    }

    render() {
        return <AppNavigator />;
    }
}

export default MyApp;
