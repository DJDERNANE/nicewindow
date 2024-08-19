import React, { Component } from "react";
import { Screen } from "../../../components/Containers/Screen";
import { BackHandler, ScrollView, View } from "react-native";
import { TextMedium } from "../../../components/Text";
import styles from "./styles";
import { ButtonDefault } from "../../../components/Buttons/Default";
import { BLACK, DANGER } from "../../../styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_LINK } from "../../../utils/constants";

class DeleteAccountScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    }
  }

  async delete() {
    this.setState({isLoading: true});
    const user = await AsyncStorage.getItem('user');

    fetch(API_LINK+'/account/delete', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ JSON.parse(user).api_token
      },
      body: JSON.stringify({
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        email: this.state.email,
        phone_number: this.state.phone_number,
        company_name: this.state.company_name
      })
    })
    .then((response) => response.json())
    .then((json) => {
      if(json.success)
      {
        this.props.navigation.navigate('Logout');
      }
    })
  }

  render() {
    return(
      <Screen>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.formGroup}>
              <TextMedium style={styles.description}>بضغطك على زر حذف الحساب، لن تتمكن من إسترجاعه مرة أخرى، سيتم حذف بيانات حسابك بصفة نهائية، سنحتفط ببعض المعلومات مثل الطلبات التي قمت بها.</TextMedium>
            </View>
            <View style={styles.formGroup}>
              <ButtonDefault 
                text={'حذف'} 
                color={DANGER} 
                size={'md'} 
                loading={this.state.isLoading} 
                onPress={() => this.delete()}
              />
            </View>
            <View style={styles.formGroup}>
              <ButtonDefault 
                text={'عودة'} 
                color={BLACK} 
                size={'md'} 
              />
            </View>
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default DeleteAccountScreen;