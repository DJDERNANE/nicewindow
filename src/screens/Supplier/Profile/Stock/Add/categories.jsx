import React, { Component } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SUPPLIER_API_LINK } from "../../../../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ButtonDefault } from "../../../../../components/Buttons/Default";
import { Screen } from "../../../../../components/Containers/Screen";
import styles from "./styles";

class AddStockCategoriesScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categoriesData: null,
      categoriesLoading: true
    }
  }

  componentDidMount() {
    this.getCategories();
  }

  async getCategories() {
    const user = await AsyncStorage.getItem('user');

    fetch(SUPPLIER_API_LINK+'/categories', {
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
        categoriesData: json.categories,
        categoriesLoading: false
      });
    })
  }

  render() {
    const s = this.state;

    return(
      <Screen>
        <ScrollView>
          <View style={styles.container}>
            {s.categoriesLoading ?
              <ActivityIndicator size={'large'} />
            :
              s.categoriesData && s.categoriesData.length > 0 &&
                s.categoriesData.map((data, key) => {
                  return(
                    <ButtonDefault 
                      key={key}
                      text={data.name_en}
                      onPress={() => this.props.navigation.navigate('AddStockSubcategories', {category: data.id})}
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

export default AddStockCategoriesScreen;