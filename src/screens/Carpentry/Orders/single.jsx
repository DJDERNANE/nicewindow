import React, { Component } from "react";
import { Screen } from "../../../components/Containers/Screen";
import { ActivityIndicator, Image, Linking, ScrollView, View } from "react-native";
import styles from "./styles";
import Feather from 'react-native-vector-icons/Feather';
import { BLACK, PRIMARY } from "../../../styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MAIN_LINK, CARPENTRY_API_LINK } from "../../../utils/constants";
import { TextBold, TextMedium } from "../../../components/Text";
import { Badge } from "../../../components/Badges/Default";
import { setOrderStatus } from "../../../utils/helpers";
import { ButtonDefault } from "../../../components/Buttons/Default";

class CarpentryProfileOrderScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderData: null,
      orderLoading: true
    }
  }

  componentDidMount() {
    if (this.props.route.params && this.props.route.params.order_id) {
      this.getOrder();
    }
  }

  async getOrder() {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK + '/profile/order/' + this.props.route.params.order_id, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      }
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          orderData: json.order,
          orderLoading: false
        });
      })
  }

  render() {
    const s = this.state;

    return (
      <Screen>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>

            {s.orderLoading ?
              <ActivityIndicator size={'large'} color={PRIMARY} />
              :
              s.orderData ?
                <View>
                  <View style={styles.orderItem}>
                    <TextMedium style={styles.orderItemText}>
                      <TextBold>Supplier: </TextBold>
                      {s.orderData.supplier.firstname + ' ' + s.orderData.supplier.lastname}
                    </TextMedium>
                  </View>
                  {s.orderData.profile_order_products && s.orderData.profile_order_products.length > 0 &&
                    s.orderData.profile_order_products.map((data, key) => {
                      return (
                        <View style={[styles.orderItem, styles.orderProfileView]} key={key}>

                          <View>
                            <Image source={{ uri: MAIN_LINK + data.profile.icon }} style={styles.profileIcon} />
                          </View>
                          <View>
                            <TextBold style={styles.orderProfileViewName}>
                              {data.profile.name}
                            </TextBold>
                            <TextMedium style={styles.orderProfileViewInfos}>
                              Qty: {data.qty} | Unit price: {data.unit_price} DZD
                            </TextMedium>
                          </View>
                        </View>
                      );
                    })
                  }

                  <View style={styles.orderItem}>
                    <TextMedium style={styles.orderItemText}>
                      <TextBold>Address: </TextBold>
                      {s.orderData.shipping_address}
                    </TextMedium>
                  </View>
                  <View style={styles.orderItem}>
                    <TextMedium style={styles.orderItemText}>
                      <TextBold>Total price: </TextBold>
                      {s.orderData.total_price} DZD
                    </TextMedium>
                  </View>
                  <View style={styles.orderItem}>
                    <TextMedium style={styles.orderItemText}>
                      <TextBold>Date: </TextBold>
                      {s.orderData.created_at.split('T')[0]}
                    </TextMedium>
                  </View>
                  <View style={styles.orderItem}>
                    <TextMedium style={styles.orderItemText}>
                      <TextBold>Status: </TextBold>
                      <Badge color={setOrderStatus(s.orderData.status).color}>{setOrderStatus(s.orderData.status).label}</Badge>
                    </TextMedium>
                  </View>
                </View>
                :
                <View />
            }
          </View>
        </ScrollView>
        {s.orderData &&
          <View style={styles.footer}>
            <ButtonDefault
              icon={<Feather name="phone-call" size={22} />}
              color={BLACK}
              containerStyle={styles.footerButtonCall}
              onPress={() => Linking.openURL('tel:' + s.orderData.supplier.phone_number)}
              size={'md'}
            />
          </View>
        }
      </Screen>
    );
  }
}

export default CarpentryProfileOrderScreen;