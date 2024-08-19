import React, { useEffect, useState } from "react";
import { View } from "react-native";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Feather from 'react-native-vector-icons/Feather'
import { ButtonDefault } from "../../../components/Buttons/Default";
import { Screen } from "../../../components/Containers/Screen";
import { WHITE } from "../../../styles/colors";
import styles from "../styles";
import { useNavigation } from "@react-navigation/native";
import { SUPPLIER_API_LINK } from "../../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../../../../i18n";

export const SupplierHomeScreen = (props) => {
  const [ ordersCount, setOrdersCount ] = useState(0);
  const navigation = useNavigation();
  const { t } = i18n;

  useEffect(() => {
    const getOrdersCount = async () => {
      const user = await AsyncStorage.getItem('user');

      fetch(SUPPLIER_API_LINK+'/orders/check', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ JSON.parse(user).api_token
        }
      })
      .then((response) => response.json())
      .then((json) => {
        setOrdersCount(json);
      })
    };
    getOrdersCount();
  }, []);

  return(
    <Screen>
      <View style={styles.container}>
        <ButtonDefault 
          containerStyle={styles.button} 
          icon={<Feather name="git-pull-request" size={18} />}
          text={t('home.stock')}
          onPress={() => navigation.navigate('Stock')}
        />


        <ButtonDefault 
          containerStyle={styles.button} 
          icon={<MaterialCommunityIcons name="account-group" size={18} />}
          text={'زبائن آخرين'}
          onPress={() => navigation.navigate('Clients')}
          
        />


        <ButtonDefault 
          containerStyle={styles.button} 
          icon={<MaterialCommunityIcons name="format-list-checks" size={18} />}
          text={t('home.orders')}
          onPress={() => navigation.navigate('PSOrders')}
          badge={ordersCount}
        />

        <ButtonDefault 
          containerStyle={styles.button} 
          icon={<MaterialCommunityIcons name="cog" size={18} />}
          text={t('home.settings')}
          onPress={() => navigation.navigate('Settings')}
        />

        <ButtonDefault 
          containerStyle={styles.button} 
          icon={<SimpleLineIcons name="calculator" size={18} />}
          text={t('home.accounting')} 
          onPress={() => navigation.navigate('SupplierAccounting')}
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