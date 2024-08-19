import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, ActivityIndicator, Text } from 'react-native';
import { Screen } from '../../../../../components/Containers/Screen';
import { ButtonDefault } from '../../../../../components/Buttons/Default';
import styles from './styles';
import { ClientCard } from '../../../../../components/Cards/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPPLIER_API_LINK } from '../../../../../utils/constants';
import AddClient from '../../../../../components/Modals/AddClient';
import { DANGER, SUCCESS, PRIMARY } from '../../../../../styles/colors';
import DefaultTabs from '../../../../../components/Tabs/Default';
import { TextBold, TextExtraBold, TextMedium } from "../../../../../components/Text";
import { RevenuDetails } from '../../../../../components/Modals/RevenuDetails';
import { SpendModal } from '../../../../../components/Modals/addSpend';
import { useRoute } from '@react-navigation/native';
import { SpendsDetails } from '../../../../../components/Modals/SpendsDetails';
const ClientHistoryScreen = () => {
  const route = useRoute();
  const clientId = route.params.clientId;
  const [data, setData] = useState();
  const [paye, setPaye] = useState();
  const [credit, setCredit] = useState();
  const [profit, setProfit] = useState();
  const [total, setTotal] = useState();
  const [detailsModal, setDetailsModal] = useState(false)
  const [creditTotal, setCreditTotal] = useState(0);
  const [addcreditModalVisible, setaddcreditModalVisible]= useState(false);
  const [montant, setMontant]= useState('');
  const [note, setNote]= useState('');
  const [creditData, setCreditData] = useState();
  const [detailsModalVisible,setDetailsModalVisible] = useState(false)
  const clientDetails = async (clientId) => {
    const user = await AsyncStorage.getItem('user');

    fetch(SUPPLIER_API_LINK + '/client/' + clientId, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + JSON.parse(user).api_token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          setTotal(json.total);
          setProfit(json.profit);
          setPaye(json.paye);
          setCredit(json.credit)
          setData(json.data)
        }
      });
  };

  const creditDetails = async (clientId) => {
    const user = await AsyncStorage.getItem('user');

    fetch(SUPPLIER_API_LINK + '/credit/' + clientId, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + JSON.parse(user).api_token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        //console.log(json)
        if (json.success) {
          setCreditTotal(json.total)
          setCreditData(json.data)
        }
      });
  };

  const addCredit = async()=>{
    try {
      const user = await AsyncStorage.getItem('user');
      const response = await fetch(`${SUPPLIER_API_LINK}/credit/store`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(user).api_token}`
        },
        body: JSON.stringify({
          carpentry_id: clientId,
          montant : montant,
          note: note
        })
      });
      const json = await response.json();
      if (json.success) {
        setaddcreditModalVisible(false);
        clientDetails(clientId);
        creditDetails(clientId);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const SpendCard = ({ item }) => {
    const formattedDate = new Date(item.created_at).toLocaleDateString();
    
    return (
      <View style={{ backgroundColor: '#e4e4e4', marginVertical: 10, padding: 10 }}>
        <View style={styles.header}>
          <View>
            <TextBold>{item.note} </TextBold>
            <TextBold> Montant : {item.montant}.00 DA</TextBold>
            <TextMedium>{formattedDate}</TextMedium>
          </View>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{ backgroundColor: '#e4e4e4', marginVertical: 10, padding: 10 }}>
        <View>
          <TextBold style={{ fontSize: 25 }}>order Id : {item.id} </TextBold>
          <TextBold> Total : {item.total_price}.00 DA</TextBold>
          <TextBold> Paye : {item.paye}.00 DA</TextBold>
          <TextBold> Credit : {item.credit}.00 DA</TextBold>
          <TextBold> Marge Benificiere : {item.profit}.00 DA</TextBold>
        </View>
      </View>
    )

  };
  useEffect(() => {clientDetails(clientId);creditDetails(clientId)}, [])
  return (

    <Screen>
      <Screen
        refreshControl={
          <RefreshControl />
        }
        contentContainerStyle={{ flex: 1 }}
        keyboardShouldPersistTaps={'always'}
      >
        <View style={{ backgroundColor: '#e4e4e4', margin: 20, padding: 10 }}>
          <View style={styles.header}>
            <View>
              <TextBold style={{ fontSize: 30 }}> Total : {total}.00 DA</TextBold>
              <TextBold style={{ fontSize: 20 }}> paye : {paye}.00 DA</TextBold>
              <TextBold style={{ fontSize: 20 }}> credit : {credit}.00 DA</TextBold>
              <TextBold style={{ fontSize: 20 }}> Marge Benificiere : {profit}.00 DA</TextBold>
            </View>
          </View>
          <ButtonDefault
            text="Show Details"
            onPress={() => setDetailsModal(true)}
          //size={'sm'}
          />
        </View>

        <View style={{ backgroundColor: '#e4e4e4', margin: 20, padding: 10 }}>
          <View style={styles.header}>
            <View>
              <TextBold style={{ fontSize: 20 }}> Autre Credit  : {creditTotal}.00 DA</TextBold>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <ButtonDefault
                text="+ Add Credit"
              onPress={() => setaddcreditModalVisible(true)}
              //size={'sm'}
              />
              <ButtonDefault
                text="show Details"
                onPress={() => setDetailsModalVisible(true)}
              //size={'sm'}
              />
            </View>
          </View>
        </View>
        <RevenuDetails
          isVisible={detailsModal}
          onCancel={() => setDetailsModal(false)}
          data={data}
          renderItem={renderItem}
        />

        <SpendModal
          isVisible={addcreditModalVisible}
          onCancel={() => setaddcreditModalVisible(false)}
          montant={montant}
          note={note}
          onChangeMontant={(value) => setMontant(value)}
          onChangeNote={(value) => setNote(value)}
          onConfirm={addCredit}
        />
        <SpendsDetails
          isVisible={detailsModalVisible}
          onCancel={() => setDetailsModalVisible(false)}
          data={creditData}
          renderItem={SpendCard}
        />
      </Screen>
    </Screen>
  );
};

export default ClientHistoryScreen;
