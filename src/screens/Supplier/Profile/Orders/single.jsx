import React, { Component } from "react";
import { Screen } from "../../../../components/Containers/Screen";
import { ActivityIndicator, Image, Linking, ScrollView, View, Alert } from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import styles from "./styles";
import { BLACK, DANGER, PRIMARY, SUCCESS, WARNING } from "../../../../styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MAIN_LINK, SUPPLIER_API_LINK } from "../../../../utils/constants";
import { ButtonDefault } from "../../../../components/Buttons/Default";
import { TextBold, TextMedium } from "../../../../components/Text";
import { Badge } from "../../../../components/Badges/Default";
import { setOrderStatus } from "../../../../utils/helpers";
import { Payement } from "../../../../components/Modals/Payment";
import { OrderRemise } from "../../../../components/Modals/Remise";


class ProfileSupplierOrderScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderData: null,
      orderLoading: true,
      isvisible: false,
      paye: 0,
      credit: 0,
      total_price: 0,
      orderId: 0,
      remiseModal: false,
      remise: 0,
      ItemRemiseModel: false
    }
  }

  componentDidMount() {
    if (this.props.route.params && this.props.route.params.order_id) {
      this.getOrder();
    }
  }

  async getOrder() {
    const user = await AsyncStorage.getItem('user');

    fetch(SUPPLIER_API_LINK + '/order/' + this.props.route.params.order_id, {
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

  async updateStatus(status) {
    const user = await AsyncStorage.getItem('user');

    fetch(SUPPLIER_API_LINK + '/order_status/update', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        order_id: this.state.orderData.id,
        status: status
      })
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          this.getOrder();
        }
      })
  }
  destroyOrderItem(id) {

    Alert.alert('Confirmation ', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),

      },
      {
        text: 'OK',
        onPress: () => this.destroyItem(id),
      },
    ]);
  }

  async destroyItem(id) {
    const user = await AsyncStorage.getItem('user');

    fetch(SUPPLIER_API_LINK + '/order/destroy', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        order_id: id,
      })
    })
      .then((response) => response.json())
      .then((json) => {
        //console.log(json);
        if (json.success) {
          this.getOrder();
        }
      })
  }
  async credit(item) {
    const user = await AsyncStorage.getItem('user');

    fetch(SUPPLIER_API_LINK + '/payement/credit', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        order_id: item.id,

      })
    })
      .then((response) => response.json())
      .then((json) => {
        //console.log(json)
        if (json.success) {
          this.getOrder();
        }
      })
    //console.log(id.id)
  }


  payment(item) {
    //console.log(item)
    this.setState(prevState => ({
      isvisible: true,
      paye: item.total_price - item.paye,
      credit: 0,
      total_price: item.total_price,
      orderId: item.id
    }));
  }
  changePaye(value) {
    this.setState(prevState => ({
      paye: value,
      credit: prevState.total_price - value
    }));
  }
  async updatePayement(item) {
    const user = await AsyncStorage.getItem('user');

    fetch(SUPPLIER_API_LINK + '/payement/paye', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        order_id: item,
        paye: this.state.paye,
        credit: this.state.credit
      })
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          this.getOrder();
          this.setState({
            isvisible: false
          })
        }
      })
  }
  orderRemise(item) {
    //console.log(item)
    this.setState({
      remiseModal: true,
      orderId: item
    })

  }
  itemRemise(item) {
    this.setState({
      ItemRemiseModal: true,
      orderId: item
    })
  }
  changeOrderRemise(value) {
    this.setState({
      remise: value
    })
  }
  async updateOrderRemise(item) {
    const user = await AsyncStorage.getItem('user');

    fetch(SUPPLIER_API_LINK + '/remise/order', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        order_id: item,
        remise: this.state.remise,
      })
    })
      .then((response) => response.json())
      .then((json) => {
        //console.log(json)
        if (json.success) {
          this.getOrder();
          this.setState({
            remiseModal: false
          })
        }
      })
  }

  async updateItemRemise(item) {
    const user = await AsyncStorage.getItem('user');

    fetch(SUPPLIER_API_LINK + '/remise/item', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        order_id: item,
        remise: this.state.remise,
      })
    })
      .then((response) => response.json())
      .then((json) => {
        //console.log(json)
        if (json.success) {
          this.getOrder();
          this.setState({
            ItemRemiseModal: false
          })
        }
      })
    //console.log(item)
  }

  async DeleteorderRemise(item) {
    const user = await AsyncStorage.getItem('user');

    fetch(SUPPLIER_API_LINK + '/delete/remise/order', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        order_id: item
      })
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        if (json.success) {
          this.getOrder();
          this.setState({
            remiseModal: false
          })
        }
      })
  }
  async DeleteItemRemise(item) {
    const user = await AsyncStorage.getItem('user');

    fetch(SUPPLIER_API_LINK + '/delete/remise/item', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        order_id: item
      })
    })
      .then((response) => response.json())
      .then((json) => {
        //console.log(json)
        if (json.success) {
          this.getOrder();
        }
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
                              Qty: {data.qty} | Unit price: {data.unit_price} DZD | Remise : {data.remise} %
                            </TextMedium>
                            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                              <ButtonDefault
                                text="Delete"
                                size="sm"
                                color={DANGER}
                                onPress={() => this.destroyOrderItem(data.id)}
                              />

                              {data.remise == 0 || data.remise === null ? (
                                <ButtonDefault
                                  text={'Remise'}
                                  color={SUCCESS}
                                  size={'sm'}
                                  onPress={() => this.itemRemise(data.id)}
                                />
                              ) : (
                                <ButtonDefault
                                  text={'Annuler la remise'}
                                  color={DANGER}
                                  size={'sm'}
                                  onPress={() => this.DeleteItemRemise(data.id)}
                                />
                              )}
                            </View>

                          </View>
                        </View>
                      );
                    })
                  }
                  <View style={styles.orderItem}>
                    <TextMedium style={styles.orderItemText}>
                      <TextBold>Carpentry: </TextBold>
                      {s.orderData.carpentry.firstname + ' ' + s.orderData.carpentry.lastname}
                    </TextMedium>
                  </View>
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
                  <View style={styles.orderItem}>
                    <TextMedium style={styles.orderItemText}>
                      <TextBold>Remise : {s.orderData.remise} %</TextBold>
                    </TextMedium>
                    <View>
                      {
                        s.orderData.remise == 0 || s.orderData.remise === null ? (
                          <ButtonDefault
                            text={'Remise'}
                            color={SUCCESS}
                            size={'sm'}
                            onPress={() => this.orderRemise(s.orderData.id)}
                          />
                        ) : (
                          <ButtonDefault
                            text={'Annuler la remise'}
                            color={DANGER}
                            size={'sm'}
                            onPress={() => this.DeleteorderRemise(s.orderData.id)}
                          />
                        )

                      }

                    </View>
                  </View>
                  <View style={styles.orderItem}>
                    <TextMedium style={styles.orderItemText}>
                      <TextBold>Status de payement: {s.orderData.payment_status == 0 ? '' : s.orderData.payment_status}</TextBold>
                    </TextMedium>
                    <View>
                      {s.orderData.credit === null || s.orderData.credit == 0 ? '' : (
                        <TextBold>Il reste : {s.orderData.credit} DA</TextBold>
                      )}
                    </View>
                    {s.orderData.payment_status === 'paye totalement' ? '' : (
                      <View style={styles.payment}>
                        <ButtonDefault
                          text={'Paye'}
                          color={SUCCESS}
                          onPress={() => this.payment(s.orderData)}
                        />
                        {s.orderData.payment_status == 0 ? (<ButtonDefault
                          text={'Credit'}
                          color={WARNING}
                          onPress={() => this.credit(s.orderData)}
                        />) : ''}


                      </View>
                    )}


                  </View>
                </View>
                :
                <View />
            }
          </View>
        </ScrollView>
        {s.orderData &&
          <View style={styles.footer}>
            {Number(s.orderData.status) < 2 &&
              <ButtonDefault
                text={'Cancel'}
                color={DANGER}
                containerStyle={styles.footerButton}
                onPress={() => this.updateStatus(3)}
                size={'md'}
              />
            }

            {Number(s.orderData.status) === 0 &&
              <ButtonDefault
                text={'En Route'}
                color={WARNING}
                containerStyle={styles.footerButton}
                onPress={() => this.updateStatus(1)}
              />
            }

            {Number(s.orderData.status) === 1 &&
              <ButtonDefault
                text={'Devlivered'}
                color={SUCCESS}
                containerStyle={styles.footerButton}
                onPress={() => this.updateStatus(2)}
                size={'md'}
              />
            }

            <ButtonDefault
              icon={<Feather name="phone-call" size={22} />}
              color={BLACK}
              containerStyle={styles.footerButtonCall}
              onPress={() => Linking.openURL('tel:' + s.orderData.carpentry.phone_number)}
              size={'md'}
            />
          </View>
        }
        <Payement
          isVisible={s.isvisible}
          onCancel={() => this.setState({ isvisible: false })}
          onChangePaye={(value) => this.changePaye(value)}
          paye={s.paye}
          // onChangeCredit
          credit={s.credit}
          onConfirm={() => this.updatePayement(s.orderId)}
        />
        <OrderRemise
          isVisible={s.remiseModal}
          onCancel={() => this.setState({ remiseModal: false })}
          onChangeRemise={(value) => this.changeOrderRemise(value)}
          remise={s.remise}
          onConfirm={() => this.updateOrderRemise(s.orderId)}
        />
        <OrderRemise
          isVisible={s.ItemRemiseModal}
          onCancel={() => this.setState({ ItemRemiseModel: false })}
          onChangeRemise={(value) => this.changeOrderRemise(value)}
          remise={s.remise}
          onConfirm={() => this.updateItemRemise(s.orderId)}
        />

      </Screen>
    );
  }
}

export default ProfileSupplierOrderScreen;