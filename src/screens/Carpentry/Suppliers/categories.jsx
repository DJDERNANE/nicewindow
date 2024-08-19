import React, { Component, Fragment } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import { Screen } from "../../../components/Containers/Screen";
import { ButtonDefault } from "../../../components/Buttons/Default";
import styles from "./styles";
import { TextBold } from "../../../components/Text";
import { PRIMARY } from "../../../styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CARPENTRY_API_LINK } from "../../../utils/constants";
import i18n from "../../../../i18n";

class CarpentrySuppliersCategoriesScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categoriesData: null,
      categoriesLoading: true,

      selectedCategories: []
    }
  }

  async getCategories() {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK+'/categories', {
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

  componentDidMount() {
    this.getCategories();
  }

  toggleCategorySelection = (categoryId) => {
    this.setState((prevState) => {
      if (prevState.selectedCategories.includes(categoryId)) {
        return {
          selectedCategories: prevState.selectedCategories.filter(
            (id) => id !== categoryId
          ),
        };
      } else {
        return {
          selectedCategories: [...prevState.selectedCategories, categoryId],
        };
      }
    });
  };

  render() {
    const s = this.state;

    return(
      <Screen>
        <ScrollView>
          <View style={styles.container}>
            {s.categoriesLoading ?
              <ActivityIndicator color={PRIMARY} size={'large'} />
            :
              <Fragment>
                {s.categoriesData && s.categoriesData.length > 0 &&
                  s.categoriesData.map((data, key) => {
                    return(
                      <Pressable style={styles.checkbox} key={key} onPress={() => this.toggleCategorySelection(data.id)}>
                        <TextBold style={styles.checkboxText}>{i18n.language === 'ar' ? data.name_ar : i18n.language === 'fr' ? data.name_fr : data.name_en}</TextBold>
                        {s.selectedCategories.includes(data.id) &&                      
                          <Feather name="check" size={18} />
                        }
                      </Pressable>
                    );
                  })
                }
    
                <ButtonDefault 
                  containerStyle={styles.searchButton} 
                  text={ i18n.t('suppliers.categories.button') } 
                  onPress={() => this.props.navigation.navigate('CarpentrySuppliersSearch', {categories: s.selectedCategories})}
                  disabled={s.selectedCategories.length <= 0}
                />
              </Fragment>
            }
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default CarpentrySuppliersCategoriesScreen;