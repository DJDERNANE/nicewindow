import React, { Component } from "react";
import { Screen } from "../../../../components/Containers/Screen";

import { ActivityIndicator, Pressable, ScrollView, View, Text ,FlatList, TouchableOpacity} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { ButtonDefault } from "../../../../components/Buttons/Default";
import styles from "./styles";
import { CartCard } from "../../../../components/Cards/Cart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_LINK, CARPENTRY_API_LINK, MAIN_LINK, SUPPLIER_API_LINK } from "../../../../utils/constants";
import { DANGER, PRIMARY } from "../../../../styles/colors";
import { DefaultAlert } from "../../../../components/Alerts/Default";
import { Label } from "../../../../components/Forms/Label";
import { TextMedium } from "../../../../components/Text";
import { DefaultInput } from "../../../../components/Inputs/default";
import Radiostyles from "../../../../components/Modals/style";

class SupplierCartScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cartData: null,
      cartLoading: true,

      addressesData: null,
      addressesLoading: true,

      storeLoading: false,
      selected_shipping_address: null,

      alertText: null,
      clients: null,
      clientSelected: null
    }
  }

  componentDidMount() {
    this.getCart();
    this.getClients();
  }

  async getCart() {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK + '/cart', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        supplier_id: this.props.route?.params?.supplier
      })
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          cartData: json.cart,
          cartLoading: false
        }, () => {
          this.getAddresses();
        });
      })
  }

  async getAddresses() {
    const user = await AsyncStorage.getItem('user');

    fetch(API_LINK + '/locations', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      }
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        this.setState({
          addressesData: json.locations,
          addressesLoading: false
        });
      })
  }

  async deleteCart(id) {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK + '/cart/destroy', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        id: id
      })
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          this.getCart();
        }
      })
  }

  async storeOrder() {
    this.setState({ storeLoading: true });
    const user = await AsyncStorage.getItem('user');

    fetch(SUPPLIER_API_LINK + '/profile/order/store', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        shipping_address: this.state.selected_shipping_address,
        carpentry_id : this.state.clientSelected ? this.state.clientSelected: null
      })
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (json.success) {
          this.setState({
            storeLoading: false
          });

          this.props.navigation.navigate('Home')
        }
        else {
          this.setState({
            storeLoading: false,
            
          });
        }
      })
  }
  async getClients() {
    const LINK = SUPPLIER_API_LINK + '/clients';
    try {
        const user = await AsyncStorage.getItem('user');

        const response = await fetch(LINK, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + JSON.parse(user).api_token,
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const jsonData = await response.json();
        console.log(LINK,jsonData.res)
        this.setState({
            clients: jsonData.res,
            clientLoading: false
        })

    } catch (error) {
        console.error('Error fetching stock:', error);
    }
   
}
handleOptionSelect(option) {
  this.setState({
    clientSelected: option
  });
  
}
  render() {
    const s = this.state;
    const  renderItem = ({ item }) => {
      return (
        <View>
          <TouchableOpacity
          style={[
            Radiostyles.option,
            s.clientSelected === item.id && Radiostyles.selectedOption,
          ]}
            onPress={() => this.handleOptionSelect(item.id)}
          >
            <Text style={Radiostyles.optionText}>{item.firstname}  {item.lastname}</Text>
          </TouchableOpacity>
        </View>
      )
  
    };
    
    return (
      <Screen>
        {s.alertText &&
          <DefaultAlert type={DANGER} alertClose={() => this.setState({ alertText: null })}>
            {s.alertText}
          </DefaultAlert>
        }
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            {s.cartLoading ?
              <ActivityIndicator size={'large'} color={PRIMARY} />
              :
              s.cartData && s.cartData.length > 0 &&
              s.cartData.map((data, key) => {
                return (
                  <CartCard
                    key={key}
                    client_name={data.supplier.firstname + ' ' + data.supplier.lastname}
                    price={data.unit_price * data.qty}
                    profile_name={data.profile.name}
                    qty={data.qty}
                    icon={MAIN_LINK + data.profile.icon}
                    onDelete={() => this.deleteCart(data.id)}
                  />
                );
              })
            }
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <View style={styles.formGroup}>
            <Label required>Shipping address:</Label>
            {s.addressesLoading ?
              <ActivityIndicator color={PRIMARY} />
              :
              s.addressesData && s.addressesData.length > 0 &&
              s.addressesData.map((data, key) => {
                return (
                  <Pressable
                    style={
                      [
                        styles.formGroup,
                        styles.addressView,
                        s.selected_shipping_address === data.address && { borderColor: PRIMARY }
                      ]
                    }
                    key={key}
                    onPress={() => this.setState({ selected_shipping_address: data.address })}
                  >
                    <TextMedium>{data.address}</TextMedium>
                  </Pressable>
                );
              })
            }

            {s.addressesData && s.addressesData.length === 0 ? (
              <View>
                <DefaultInput value={s.selected_shipping_address} onChangeText={(value) => this.setState({ selected_shipping_address: value })} />
                <View style={styles.formGroup}>
                  <Label required>Selectionner un client :</Label>
                  <FlatList
                    data={s.clients}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                  />
                </View>
              </View>) : ''}





          </View>
          <ButtonDefault
            text={'Confirm order'}
            onPress={() => this.storeOrder()}
            loading={s.storeLoading}
            disabled={s.storeLoading || s.cartData?.length <= 0 || !s.selected_shipping_address}
          />
        </View>
      </Screen>
    );
  }
}

export default SupplierCartScreen;