import React, { Component } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, View } from "react-native";
import { Screen } from "../../../components/Containers/Screen";
import { SupplierCard } from "../../../components/Cards/Supplier";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CARPENTRY_API_LINK } from "../../../utils/constants";
import { PRIMARY } from "../../../styles/colors";
import styles from './styles';
import { TextBold, TextMedium } from "../../../components/Text";
import i18n from "../../../../i18n";

class SuppliersScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suppliersData: null,
      suppliersLoading: true
    }
  }

  componentDidMount() {
    this.getFavoritesSuppliers();
  }

  async getFavoritesSuppliers() {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK+'/suppliers/favorites', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ JSON.parse(user).api_token
      }
    })
    .then((response) => response.json())
    .then((json) => {
      this.setState({
        suppliersData: json.favorites,
        suppliersLoading: false
      });
    })
  }

  render() {
    const s = this.state;
    
    return(
      <Screen>
        <ScrollView refreshControl={
          <RefreshControl 
            onRefresh={() => this.getFavoritesSuppliers()}
            refreshing={s.suppliersLoading}
          />
        }>
          <View style={styles.container}>
            <View style={styles.header}>
              <TextBold style={styles.title}>{ i18n.t('suppliers.favorites') }</TextBold>
              <Pressable onPress={() => this.props.navigation.navigate('CarpentrySuppliersSearch')}>
                <TextMedium style={styles.moreText}>{ i18n.t('suppliers.search') }</TextMedium>
              </Pressable>
            </View>
            {s.suppliersLoading ?
              <ActivityIndicator color={PRIMARY} size={'large'} />
            :
              s.suppliersData && s.suppliersData.length > 0 &&
                s.suppliersData.map((data, key) => {
                  return(
                    <SupplierCard 
                      data={data.supplier}
                      key={key}
                    />
                  );
                })
            }
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default SuppliersScreen;