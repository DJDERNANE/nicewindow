import React, { Component } from "react";
import { Screen } from "../../../../components/Containers/Screen";
import { ScrollView, View } from "react-native";
import styles from "./styles";
import { DefaultInput } from "../../../../components/Inputs/default";
import { Label } from "../../../../components/Forms/Label";
import { ButtonDefault } from "../../../../components/Buttons/Default";
import { PasswordInput } from "../../../../components/Inputs/Password";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CARPENTRY_API_LINK } from "../../../../utils/constants";
import { DefaultAlert } from "../../../../components/Alerts/Default";
import { DANGER } from "../../../../styles/colors";

class EditUserScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      alertText: null,

      id: null,
      firstname: null,
      lastname: null,
      email: null,
      password: null,
      phone_number: null
    }
  }

  componentDidMount() {
    this.setUserData();
  }

  setUserData() {
    if(this.props.route?.params?.userData)
    {
      this.setState({
        id: this.props.route.params.userData.id,
        firstname: this.props.route.params.userData.firstname,
        lastname: this.props.route.params.userData.lastname,
        email: this.props.route.params.userData.email,
        phone_number: this.props.route.params.userData.phone_number
      });
    }
    else
    {
      this.props.navigation.navigate('UsersSettings');
    }
  }
  handleChange(name, value) {
    this.setState({
      ...this.state,
      [name]: value
    })
  }

  async update() {
    this.setState({isLoading: true});
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK+'/user/update', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ JSON.parse(user).api_token
      },
      body: JSON.stringify({
        id: this.state.id,
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        phone_number: this.state.phone_number,
        email: this.state.email,
        password: this.state.password
      })
    })
    .then((response) => response.json())
    .then((json) => {
      if(json.success)
      {
        this.setState({isLoading: false});
        this.props.navigation.navigate('UsersSettings');
      }
      else
      {
        this.setState({
          isLoading: false,
          alertText: json.message
        });
      }
    })
  }

  render() {
    const s = this.state;

    return(
      <Screen>
        {s.alertText &&
          <DefaultAlert 
            type={DANGER} 
            alertClose={() => this.setState({alertText: null})}
          >
            {s.alertText}
          </DefaultAlert>
        }
        <ScrollView keyboardShouldPersistTaps={'always'}>
          <View style={styles.container}>
            <View style={styles.formGroup}>
              <Label required>Firstname: </Label>
              <DefaultInput 
                onChangeText={(value) => this.handleChange('firstname', value)} 
                value={s.firstname} 
              />
            </View>

            <View style={styles.formGroup}>
              <Label required>Lastname: </Label>
              <DefaultInput 
                onChangeText={(value) => this.handleChange('lastname', value)} 
                value={s.lastname} 
              />
            </View>

            <View style={styles.formGroup}>
              <Label required>Phone number: </Label>
              <DefaultInput 
                onChangeText={(value) => this.handleChange('phone_number', value)} 
                value={s.phone_number} 
              />
            </View>

            <View style={styles.formGroup}>
              <Label required>Email: </Label>
              <DefaultInput 
                onChangeText={(value) => this.handleChange('email', value)} 
                value={s.email} 
              />
            </View>

            <View style={styles.formGroup}>
              <Label>Password: </Label>
              <PasswordInput
                onChangeText={(value) => this.handleChange('password', value)} 
                value={s.password} 
              />
            </View>

            <View style={styles.formGroup}>
              <ButtonDefault 
                text={'Save'} 
                onPress={() => this.update()} 
              />
            </View>
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default EditUserScreen;