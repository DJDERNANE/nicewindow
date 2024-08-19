import React, { useState, useEffect, Component } from "react";
import { ScrollView, TouchableOpacity, View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CARPENTRY_API_LINK } from "../../utils/constants";
import styles from "./styles";
import { Screen } from "../../components/Containers/Screen";
import { DANGER, PRIMARY, SUCCESS, WARNING } from "../../styles/colors";
import { TextBold, TextExtraBold, TextMedium } from "../../components/Text";
import { SpendsDetails } from '../../components/Modals/SpendsDetails';
import { ButtonDefault } from "../../components/Buttons/Default";


class CarpentryRevenuScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      paye: null,
      credit: null,
      detailsModalVisible: false,
      data: null
    }
  }

  componentDidMount() {
    this.getRevenus();
  }

  getRevenus = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      const response = await fetch(`${CARPENTRY_API_LINK}/accounting/totalrevenuDetails`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(user).api_token}`
        }
      });
      const json = await response.json();
      if (json.success) {
        this.setState({
          paye: json.paye,
          credit: json.credit
        })
      }
    } catch (error) {
      console.error(error);
    }
  };
 

  getDetails = async () => {
    this.setState({detailsModalVisible : true});
    try {
      const user = await AsyncStorage.getItem('user');
      const response = await fetch(`${CARPENTRY_API_LINK}/accounting/revenu/details`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(user).api_token}`
        }
      });
      const json = await response.json();
      if (json.success) {
        this.setState({data: json.data});
      }
     
    } catch (error) {
      console.error(error);
    }
  };


  SpendCard = ({ item }) => {
    const formattedDate = new Date(item.created_at).toLocaleDateString();
    
    return (
      <View style={{ backgroundColor: '#e4e4e4', marginVertical: 10, padding: 10 }}>
        <View style={styles.header}>
          <View>
            <TextBold> {item.client.name} </TextBold>
            <TextBold> paye : {item.paye}.00 DA</TextBold>
            <TextBold> credit : {item.credit}.00 DA</TextBold>
            <TextMedium>{formattedDate}</TextMedium>
          </View>
        </View>
      </View>
    );
  };
  render() {
    const s = this.state;
    return (
      <Screen>
        <ScrollView>
          <View style={styles.container}>



            <TouchableOpacity style={styles.accountingCard} >
              <View>
                <TextBold style={[styles.sectionTitleText, { color: SUCCESS }]}>مدفوع</TextBold>
                <TextExtraBold style={[styles.sectionContentText, { color: SUCCESS }]}>{s.paye}.00 DZD</TextExtraBold>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.accountingCard} >
              <View>
                <TextBold style={[styles.sectionTitleText, { color: WARNING }]}>كريدي</TextBold>
                <TextExtraBold style={[styles.sectionContentText, { color: WARNING }]}>{s.credit}.00 DZD</TextExtraBold>
              </View>
            </TouchableOpacity>
            <ButtonDefault
                color={SUCCESS}
                text=" التفاصيل"
                onPress={() => this.getDetails()}
                containerStyle={{ marginTop: 15 }}
              />
         

          </View>
          <SpendsDetails
            isVisible={s.detailsModalVisible}
            onCancel={() => this.setState({detailsModalVisible:false}) }
            data={s.data}
            renderItem={this.SpendCard}
          />
        </ScrollView>
      </Screen>
    );
  }
}

export default CarpentryRevenuScreen;