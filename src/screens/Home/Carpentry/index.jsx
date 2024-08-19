import React from "react";
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

export const CarpentryHomeScreen = ({user}) => {
  const navigation = useNavigation();
  const { t } = i18n;

  return(
    <Screen>
      <View style={styles.container}>
        <ButtonDefault 
          containerStyle={styles.button} 
          icon={<Feather name="git-pull-request" size={18} />}
          text={t('home.estimate')}
          onPress={() => navigation.navigate('Estimate')}
        />

        <ButtonDefault 
          containerStyle={styles.button} 
          icon={<MaterialCommunityIcons name="format-list-checks" size={18} />}
          text={t('home.orders')} 
          onPress={() => navigation.navigate('CarpentryOrders')}
        />

        <ButtonDefault 
          containerStyle={styles.button} 
          icon={<MaterialCommunityIcons name="timetable" size={18} />}
          text={t('home.appointments')} 
          onPress={() => navigation.navigate('Appointments')}
        />

        <ButtonDefault 
          containerStyle={styles.button} 
          icon={<Feather name="truck" size={18} />}
          text={t('home.suppliers')} 
          onPress={() => navigation.navigate('CarpentrySuppliersSearch')}
        />

        {!user.master_id &&
          <ButtonDefault 
            containerStyle={styles.button} 
            icon={<SimpleLineIcons name="calculator" size={18} />}
            text={t('home.accounting')} 
            onPress={() => navigation.navigate('CarpentryAccounting')}
          />
        }
        
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