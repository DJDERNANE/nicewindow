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

class FromSupplier extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ordersData: null,
      ordersLoading: true,
      moreOrdersLoading: false,
      page: 1,
    }
  }

  componentDidMount() {
    this.getOrders();
  }

  async getOrders() {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK+'/profile/orders?page='+this.state.page, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ JSON.parse(user).api_token
      }
    })
    .then((response) => response.json())
    .then((json) => {
      this.setState({
        ordersData: this.state.ordersData ? this.state.page > 1 ? { ...this.state.ordersData, data: [...this.state.ordersData.data, ...json.orders.data] } : json.orders : json.orders,
        ordersLoading: false,
        moreOrdersLoading: false
      });
    })
  }

  handleScroll(event) {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isEndReached = contentOffset.y >= (contentSize.height - layoutMeasurement.height - 100);
    if (isEndReached)
    {
      if(!this.state.moreOrdersLoading && this.state.ordersData.last_page > this.state.page)
      {
        this.setState({
          page: this.state.page+1,
          moreOrdersLoading: true
        }, () => {
          this.getOrders();
        });
      }
    }
  }

  render() {
    const s = this.state;

    return(
        <ScrollView  
          refreshControl={
            <RefreshControl 
              onRefresh={() => this.getOrders()}
              refreshing={s.ordersLoading}
            />
          }
          contentContainerStyle={{flexGrow: 1}}
          onScroll={(event) => this.handleScroll(event)}
        >
          <View>

            {s.ordersLoading ?
              <ActivityIndicator color={PRIMARY} size={'large'} />
              :
              s.ordersData && s.ordersData.data && s.ordersData.data.length > 0 &&
                s.ordersData.data.map((data, key) => {
                  return(
                    <OrderCard 
                      id={data.id}
                      key={key}
                      date={data.created_at}
                      price={data.total_price}
                      client_name={data.supplier.firstname+' '+data.supplier.lastname}
                      status={data.status}
                      display={'carpentry'}
                    />
                  );
                })
            }
          </View>
        </ScrollView>
    );
  }
}

export default FromSupplier