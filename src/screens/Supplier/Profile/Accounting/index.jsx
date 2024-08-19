import React, { useState, useEffect } from "react";
import { ScrollView, TouchableOpacity, View, ActivityIndicator, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SUPPLIER_API_LINK } from "../../../../utils/constants";
import styles from "./styles";
import { Screen } from "../../../../components/Containers/Screen";
import { DANGER, PRIMARY, SUCCESS } from "../../../../styles/colors";
import { TextBold, TextExtraBold, TextMedium } from "../../../../components/Text";
import i18n from "../../../../../i18n";
import { ButtonDefault } from "../../../../components/Buttons/Default";
import { SpendModal } from '../../../../components/Modals/addSpend';
import { SpendsDetails } from '../../../../components/Modals/SpendsDetails';
import { useNavigation } from "@react-navigation/native";
import FilterModal from "../../../../components/Modals/FilterModal";



const SupplierAccountingScreen = () => {
  const navigation = useNavigation();
  const [spendModalVisible, setSpendModalVisible] = useState(false);
  const [montant, setMontant] = useState(0);
  const [note, setNote] = useState('');
  const [total, setTotal] = useState(0);
  const [spend, setSpend] = useState(0);
  const [revenu, setRevenu] = useState(0);
  const [profit, setProfit] = useState(0);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false)
  const [startDay, setStartDay] = useState(null)
  const [endDay, setEndDay] = useState(null)
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  useEffect(() => {
    getSpend();
    getRevenu();
  }, []);
  useEffect(() => {
    // Update total whenever revenu or spend changes
    setTotal(revenu - spend);
  }, [revenu, spend]);

  const getSpend = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      const response = await fetch(`${SUPPLIER_API_LINK}/accounting/total`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(user).api_token}`
        }
      });
      const json = await response.json();
      if (json.success) {
        setSpend(json.spends);

      }
    } catch (error) {
      console.error(error);
    }
  };

  const addSpend = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      const response = await fetch(`${SUPPLIER_API_LINK}/accounting/store`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(user).api_token}`
        },
        body: JSON.stringify({
          montant,
          note
        })
      });
      const json = await response.json();
      if (json.success) {
        setSpendModalVisible(false);
        getSpend();
        // getRevenu();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getDetails = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      const response = await fetch(`${SUPPLIER_API_LINK}/accounting/spend/details`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(user).api_token}`
        }
      });
      const json = await response.json();
      if (json.success) {
        setData(json.spends);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getRevenu = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      const response = await fetch(`${SUPPLIER_API_LINK}/accounting/totalprofit`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(user).api_token}`
        }
      });
      const json = await response.json();
      if (json.success) {
        setRevenu(json.revenu);
        setProfit(json.profit);
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  const handleSpendDetails = () => {
    getDetails();
    setDetailsModalVisible(true);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setStartDay(date.toLocaleDateString());
    hideDatePicker();
  };
  const handleConfirmEndday = (Enddate) => {
    setEndDay(Enddate.toLocaleDateString());
    hideEndDatePicker();
  };

  const filter = async() => {
    setFilterVisible(false)
    try {
      const user = await AsyncStorage.getItem('user');
      const url = endDay? `${SUPPLIER_API_LINK}/accounting/total/filter?startday=${startDay}&&endday=${endDay}` : `${SUPPLIER_API_LINK}/accounting/total/filter?startday=${startDay}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(user).api_token}`
        }
      });
      const json = await response.json();
     if (json.success) {
        setEndDay(null)
       setStartDay(null)
       setRevenu(json.revenu)
       setProfit(json.profit)
       setSpend(json.spends)
     }
      
       
      
    } catch (error) {
      console.error(error);
    }
  }
  
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size={'large'} color={PRIMARY} />
          ) : (
            <View>
              <ButtonDefault
                color={DANGER}
                text={ i18n.t('profit.addspend') }
                onPress={() => setSpendModalVisible(true)}
                containerStyle={{ marginBottom: 15 }}
              />

              <ButtonDefault
                color={SUCCESS}
                text={ i18n.t('profit.filter') }
                onPress={() => setFilterVisible(true)}
                containerStyle={{ marginBottom: 15 }}
              />

              <TouchableOpacity style={styles.accountingCard}>
                <View>
                  <TextBold style={[styles.sectionTitleText, { color: total > 0 ? SUCCESS : DANGER }]}>{ i18n.t('profit.total') }</TextBold>
                  <TextExtraBold style={[styles.sectionContentText, { color: total > 0 ? SUCCESS : DANGER }]}>
                    {total}.00 DZD
                  </TextExtraBold>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.accountingCard} onPress={() => navigation.navigate('Revenu')}>
                <View>
                  <TextBold style={[styles.sectionTitleText, { color: SUCCESS }]}>{ i18n.t('profit.profit') }</TextBold>
                  <TextExtraBold style={[styles.sectionContentText, { color: SUCCESS }]}>{revenu}.00 DZD</TextExtraBold>
                  <TextBold style={[styles.sectionTitleText, { color: SUCCESS }]}>الربح الصافي</TextBold>
                  <TextExtraBold style={[styles.sectionContentText, { color: SUCCESS }]}>{profit}.00 DZD</TextExtraBold>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.accountingCard} onPress={handleSpendDetails}>
                <View>
                  <TextBold style={[styles.sectionTitleText, { color: DANGER }]}>{ i18n.t('profit.addspend') }</TextBold>
                  <TextExtraBold style={[styles.sectionContentText, { color: DANGER }]}>{spend}.00 DZD</TextExtraBold>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <SpendModal
          isVisible={spendModalVisible}
          onCancel={() => setSpendModalVisible(false)}
          montant={montant}
          note={note}
          onChangeMontant={(value) => setMontant(value)}
          onChangeNote={(value) => setNote(value)}
          onConfirm={addSpend}
        />
        <SpendsDetails
          isVisible={detailsModalVisible}
          onCancel={() => setDetailsModalVisible(false)}
          data={data}
          renderItem={SpendCard}
        />

        <FilterModal
          isVisible={filterVisible}
          oneDay={startDay}
          endDay={endDay}
          isDatePickerVisible={isDatePickerVisible}
          isEndDatePickerVisible={isEndDatePickerVisible}
          showDatePicker={showDatePicker}
          showEndDatePicker={showEndDatePicker}
          onExit={() => {setFilterVisible(false);
                              setEndDay(null);
                              setStartDay(null)}}
          handleConfirmStartday={handleConfirm}
          hideDatePicker={hideDatePicker}
          hideEndDatePicker={hideEndDatePicker}
          handleConfirmEndday={handleConfirmEndday}
          onFilter={filter}
        />
      </ScrollView>
    </Screen>
  );
};

export default SupplierAccountingScreen;
