import React, { Component } from "react";
import { Screen } from "../../../../../components/Containers/Screen";
import { View } from "react-native";
import styles from "./styles";
import { Label } from "../../../../../components/Forms/Label";
import { DefaultInput } from "../../../../../components/Inputs/default";
import { ButtonDefault } from "../../../../../components/Buttons/Default";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CARPENTRY_API_LINK } from "../../../../../utils/constants";
import { DefaultAlert } from "../../../../../components/Alerts/Default";
import { DANGER } from "../../../../../styles/colors";
import i18n from "../../../../../../i18n";

class AddClientScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: null,
      phone_number: null,
      notes: null,

      addLoading: false,
      alertText: null
    }
  }

  async storeClient() {
    this.setState({addLoading: true});
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK+'/client/store', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ JSON.parse(user).api_token
      },
      body: JSON.stringify({
        name: this.state.name,
        phone_number: this.state.phone_number,
        notes: this.state.notes
      })
    })
    .then((response) => response.json())
    .then((json) => {
      if(json.success)
      {
        this.setState({addLoading: false});
        this.props.navigation.navigate('Canvas', {client: json.client});
      }
      else
      {
        this.setState({
          addLoading: false,
          alertText: json.message
        });
      }
    })
  }

  handleChange(name, value) {
    this.setState({
      ...this.state,
      [name]: value
    })
  }

  render() {
    const s = this.state;

    return(
      <Screen>
        {s.alertText &&
          <DefaultAlert type={DANGER} alertClose={() => this.setState({alertText: null})}>{s.alertText}</DefaultAlert>
        }
        <View style={styles.container}>
          <View style={styles.formGroup}>
            <Label required>{ i18n.t('clients.name') }: </Label>
            <DefaultInput 
              value={s.name}
              onChangeText={(value) => this.handleChange('name', value)}
            />
          </View>
          <View style={styles.formGroup}>
            <Label required>{ i18n.t('clients.phone') }: </Label>
            <DefaultInput 
              value={s.phone_number}
              onChangeText={(value) => this.handleChange('phone_number', value)}
            />
          </View>
          <View style={styles.formGroup}>
            <Label>{ i18n.t('clients.address') }: </Label>
            <DefaultInput 
              value={s.notes}
              onChangeText={(value) => this.handleChange('notes', value)}
            />
          </View>
          <View style={styles.formGroup}>
            <ButtonDefault text={'Save'} onPress={() => this.storeClient()} />
          </View>
        </View>
      </Screen>
    );
  }
}

export default AddClientScreen;