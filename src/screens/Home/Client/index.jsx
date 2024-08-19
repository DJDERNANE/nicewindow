import React ,{useEffect, useState} from "react";
import { View } from "react-native";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Feather from 'react-native-vector-icons/Feather'
import { ButtonDefault } from "../../../components/Buttons/Default";
import { Screen } from "../../../components/Containers/Screen";
import { WHITE } from "../../../styles/colors";
import styles from "../styles";
import { useNavigation } from "@react-navigation/native";
import i18n from "../../../../i18n";
import { CARPENTRY_API_LINK } from "../../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const ClientHomeScreen = (props) => {
  const navigation = useNavigation();
  const { t } = i18n;
  const [data,setData] = useState()
  const  getClient = async()=> {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK+'/client?id='+1, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ JSON.parse(user).api_token
      }
    })
    .then((response) => response.json())
    .then((json) => {
      setData(json.clients)
     
    })
  }

  useEffect(()=>{
    getClient();
  }, [])
  return(
    <Screen>
      <View style={styles.container}>
        <ButtonDefault 
          containerStyle={styles.button} 
          icon={<Feather name="git-pull-request" size={18} />}
          text={t('home.estimate')}
          onPress={() => navigation.navigate('Canvas', {client: data})}
        />

        <ButtonDefault 
          containerStyle={styles.button} 
          icon={<MaterialCommunityIcons name="application-cog-outline" color={WHITE} size={18} />}
          text={t('home.repair')}
          onPress={() => navigation.navigate('Repair')}
        />

        <ButtonDefault 
          containerStyle={styles.button} 
          icon={<MaterialCommunityIcons name="format-list-checks" size={18} />}
          text={t('home.orders')}
          onPress={() => navigation.navigate('ClientOrders')}
        />

        <ButtonDefault 
          containerStyle={styles.button} 
          icon={<MaterialCommunityIcons name="cog" size={18} />}
          text={t('home.settings')}
          onPress={() => navigation.navigate('Settings')}
        />

        <ButtonDefault 
          containerStyle={styles.button} 
          icon={<SimpleLineIcons name="logout" color={WHITE} size={16} />} 
          text={t('home.logout')}
          onPress={() => navigation.navigate('Logout')}
        />
      </View>
    </Screen>
  );
}