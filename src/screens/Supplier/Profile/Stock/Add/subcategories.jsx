import React, { Component } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Screen } from "../../../../../components/Containers/Screen";
import styles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SUPPLIER_API_LINK } from "../../../../../utils/constants";
import { ButtonDefault } from "../../../../../components/Buttons/Default";

class AddStockSubcategoriesScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subcategoriesData: null,
      subcategoriesLoading: true
    }
  }

  componentDidMount() {
    this.getSubcategories();
  }

  async getSubcategories() {
    const user = await AsyncStorage.getItem('user');

    fetch(SUPPLIER_API_LINK+'/subcategories/'+this.props.route?.params?.category, {
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
        subcategoriesData: json.subcategories,
        subcategoriesLoading: false
      });
    })
  }

  render() {
    const s = this.state;

    return(
      <Screen>
        <ScrollView>
          <View style={styles.container}>
            {s.subcategoriesLoading ?
              <ActivityIndicator size={'large'} />
            :
              s.subcategoriesData && s.subcategoriesData.length > 0 &&
                s.subcategoriesData.map((data, key) => {
                  return(
                    <ButtonDefault 
                      key={key}
                      text={data.name_en}
                      onPress={() => this.props.navigation.navigate('AddStockProfiles', {subcategory: data.id})}
                      containerStyle={{marginBottom: 20}}
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

export default AddStockSubcategoriesScreen;