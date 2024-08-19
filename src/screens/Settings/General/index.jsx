import React, { useState, useEffect } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { ButtonDefault } from "../../../components/Buttons/Default";
import { Screen } from "../../../components/Containers/Screen";
import { ProfilePicturePicker } from "../../../components/FilesPicker/ProfilePicture";
import { Label } from "../../../components/Forms/Label";
import { DefaultInput } from "../../../components/Inputs/default";
import styles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_LINK, MAIN_LINK } from "../../../utils/constants";
import { DANGER, PRIMARY, SUCCESS } from "../../../styles/colors";
import { DefaultAlert } from "../../../components/Alerts/Default";
import i18n from "../../../../i18n";
import { TextMedium } from "../../../components/Text";
import * as ImagePicker from 'expo-image-picker';

const GeneralSettingsScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [alertText, setAlertText] = useState(null);
  const [alertType, setAlertType] = useState(null);

  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone_number, setPhoneNumber] = useState(null);
  const [company_name, setCompanyName] = useState(null);
  const formData = new FormData();
  const [logo, setLogo] = useState('');

  useEffect(() => {
    getUserData();
  }, []); // Empty dependency array to mimic componentDidMount

  const handleChange = (name, value) => {
    switch (name) {
      case 'firstname':
        setFirstname(value);
        break;
      case 'lastname':
        setLastname(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'phone_number':
        setPhoneNumber(value);
        break;
      case 'company_name':
        setCompanyName(value);
        break;
      default:
        break;
    }
  }

  const getUserData = async () =>
  {
    const user = await AsyncStorage.getItem('user');

    fetch(API_LINK + '/user', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      }
    })
      .then((response) => response.json())
      .then((json) => {
        setFirstname(json.firstname);
        setLastname(json.lastname);
        setEmail(json.email);
        setPhoneNumber(json.phone_number);
        setCompanyName(json.company_name);
        setLogo(json.logo)
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }

 async function update() {
    const user = await AsyncStorage.getItem('user');
    fetch(API_LINK + '/user/update', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body:JSON.stringify({
        firstname:  firstname,
        lastname: lastname,
        email: email,
        phone_number:  phone_number,
        company_name:company_name,
      })
    })
      .then((response) => {console.log(response); return response.json()})
      .then((json) => {
       console.log(json)
       if (json.success) {
          // Handle success, e.g., show success alert
          setAlertText('Data successfully updated.');
          setAlertType( SUCCESS);
          getUserData();
        } else {
          // Handle failure, e.g., show error alert
          setAlertText(json.error);
          setAlertType(DANGER);
        }
      })
   }


  const pickImage = async () => {
    await ImagePicker.requestMediaLibraryPermissionsAsync();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });
    if (!result.canceled) {
      const filename = getFilenameFromUri(result.uri);
      uploadImage(result.uri, filename);
    }

  };

  const uploadImage = async (uri, filename) => {
    setIsLoading(true);
    const user = await AsyncStorage.getItem('user');
    formData.append('image', {
      uri: uri,
      type: 'image/jpeg',
      name: filename,
    });
    fetch(API_LINK + '/user/logo', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + JSON.parse(user).api_token
          },
          body: formData
        })
          .then((response) => {console.log(response); return response.json()})
          .then((json) => {
            setAlertText('Logo successfully updated.');
            setAlertType( SUCCESS);
            setIsLoading(false)
          })
  };

  const getFilenameFromUri = (uri) => {
    const pathArray = uri.split('/');
    return pathArray[pathArray.length - 1];
  };
  return (
    <Screen>
      {alertText &&
        <DefaultAlert type={alertType} alertClose={() => setAlertText(null)}>{alertText}</DefaultAlert>
      }
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.profilePictureView}>
            <ProfilePicturePicker pickImage={pickImage} image={logo ? MAIN_LINK + logo : ''} />
          </View>
          <View style={styles.formGroup}>
            <Label required>{i18n.t('settings.general.labels.firstname')}: </Label>
            <DefaultInput
              value={firstname}
              onChangeText={(value) => handleChange('firstname', value)}
            />
          </View>
          <View style={styles.formGroup}>
            <Label required>{i18n.t('settings.general.labels.lastname')}: </Label>
            <DefaultInput
              value={lastname}
              onChangeText={(value) => handleChange('lastname', value)}
            />
          </View>
          <View style={styles.formGroup}>
            <Label required>{i18n.t('settings.general.labels.email')}: </Label>
            <DefaultInput
              value={email}
              onChangeText={(value) => handleChange('email', value)}
            />
          </View>
          <View style={styles.formGroup}>
            <Label required>{i18n.t('settings.general.labels.phone_number')}: </Label>
            <DefaultInput
              value={phone_number}
              onChangeText={(value) => handleChange('phone_number', value)}
            />
          </View>
          <View style={styles.formGroup}>
            <Label>{i18n.t('settings.general.labels.company_name')}: </Label>
            <DefaultInput
              value={company_name}
              onChangeText={(value) => handleChange('company_name', value)}
            />
          </View>
          <View style={styles.formGroup}>
            <ButtonDefault
              text={i18n.t('settings.general.button')}
              onPress={update}
            />
          </View>
          <View style={styles.formGroup}>
            <Pressable onPress={() => navigation.navigate('DeleteSettings')}>
              <TextMedium>
                يمكنك الضغط
                <TextMedium style={{ color: PRIMARY }}> هنا </TextMedium>
                لحذف حسابك
              </TextMedium>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default GeneralSettingsScreen;
