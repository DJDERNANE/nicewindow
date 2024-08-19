import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { Screen } from "../../../../components/Containers/Screen";
import { ActivityIndicator, ScrollView, View, Alert } from "react-native";
import { LIGHT, PRIMARY } from "../../../../styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CARPENTRY_API_LINK } from "../../../../utils/constants";
import { useNavigation } from "@react-navigation/native";
import { ClientOrder } from "../../../../components/Cards/Carpentry/ClientOrder";
import styles from '../styles';
import { ConfirmOrder } from "../../../../components/Modals/confirmOrder";
const ClientOrdersList = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { client } = route.params;
  const [ordersData, setOrdersData] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [paye, setPaye] = useState(0);
  const [credit, setCredit] = useState(0);
  const [rest, setRest] = useState(0);
  const [orderId, setOrderId] = useState(null)
  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    setOrdersLoading(true);
    const user = await AsyncStorage.getItem('user');
    fetch(`${CARPENTRY_API_LINK}/orders/confirmed?client_id=${client.id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setOrdersData((prevData) => [...prevData, ...json.data]);
        setOrdersLoading(false);
      });
  }

  const onPaye = async (data) => {
    setVisible(true);
    setRest(data.credit);
    setOrderId(data.id)
  }
  const changePaye = (value) => {
    setPaye(value);
  }
  useEffect(() => {
    setCredit(rest - paye)
  }, [paye, rest]);

  orderPayement = async () => {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK + '/payement/payementcredit', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        orderId: orderId,
        credit: credit,
        paye: paye,

      })
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        if (json.success) {
          setVisible(false);
          setOrderId(null);
          getOrders();
        }
      })
  }


  return (

    <Screen>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ backgroundColor: LIGHT, padding: 20 }}>

          {ordersLoading ? (
            <ActivityIndicator color={PRIMARY} size={'large'} />
          ) : (
            ordersData &&
            ordersData &&
            ordersData.length > 0 &&
            ordersData.map((data, key) => {
              
              return (
                <ClientOrder
                  id={data.id}
                  key={key}
                  date={data.created_at}
                  price={data.total_price}
                  paye={data.paye}
                  credit={data.credit}
                  onPaye={() => onPaye(data)}
                  client={client}
                />
              )
            })
          )}
        </View>
        <ConfirmOrder
          isVisible={visible}
          onCancel={() => setVisible(false)}
          paye={paye}
          credit={credit}
          onAdd={() => orderPayement()}
          onChangePaye={(value) => changePaye(value)}
        />
      </ScrollView>
    </Screen>
  );
};

export default ClientOrdersList;
