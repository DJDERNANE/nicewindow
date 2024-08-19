import React, { Component } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
import { Screen } from "../../../components/Containers/Screen";
import { OrderCard } from "../../../components/Cards/Order";
import styles from "./styles";
import { CARPENTRY_API_LINK } from "../../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PRIMARY } from "../../../styles/colors";
import DefaultTabs from "../../../components/Tabs/Default";
import i18n from "../../../../i18n";

class ToClients extends Component {


  render() {
    const s = this.state;

    return(
        <View>
       
        </View>
    );
  }
}

export default ToClients