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
import FromSupplier from "./fromsupplier";
import ToClients from "./toclients";

class OrdersScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
     activeTab: 0,
    }
  }
  render() {
    const s = this.state;

    return(
      <Screen>
       
          <View style={styles.container}>
            <DefaultTabs 
              tabs={[ i18n.t('orders.tabs.profiles') , i18n.t('orders.tabs.clients')]} 
              activeTab={s.activeTab} 
              onChangeTab={(tab) => this.setState({activeTab: tab})}
            />

            {s.activeTab === 0 && <FromSupplier />}
            {s.activeTab === 1 && <ToClients />}
            
          </View>
      
      </Screen>
    );
  }
}

export default OrdersScreen