import React, { Component } from "react";
import { Screen } from "../../../components/Containers/Screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CARPENTRY_API_LINK } from "../../../utils/constants";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SupplierCard } from "../../../components/Cards/Supplier";
import { PRIMARY } from "../../../styles/colors";
import styles from "./styles";
import { DefaultInput } from "../../../components/Inputs/default";

class CarpentrySuppliersSearchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suppliersData: null,
      suppliersLoading: true,
      searchText: '',
      searchResults: null
    }
  }

  componentDidMount() {
    this.filterData();
  }

  async getSuppliers() {

    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK + '/suppliers?categories=' + JSON.stringify(this.props.route?.params?.categories), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      }
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          suppliersData: json.suppliers,
          suppliersLoading: false
        });
      })
  }
  handleSearchTextChange(text) {

    this.setState({ searchText: text}, () => {
      this.filterData();
    });


  }

  async filterData() {
    const {  searchText } = this.state;
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK + '/searchsupplier?search='+ searchText, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      }
    })
      .then((response) => response.json())
      .then((json) => {
        //console.log(json.suppliers)
        this.setState({
          searchResults: json.suppliers,
          suppliersLoading: false
        });
      })
}

  render() {
    const s = this.state;

    return (
      <Screen>
        <DefaultInput
          placeholder={'Search..'}
          value={s.searchText}
          onChangeText={(value) => this.handleSearchTextChange(value)}
        />
        <ScrollView>
          <View style={styles.container}>
            {s.suppliersLoading ?
             ( <ActivityIndicator color={PRIMARY} size={'large'} />) :
              s.searchResults && s.searchResults.length > 0 ?
              ( s.searchResults.map((data, key) => {
                return (<SupplierCard
                data={data}
                key={key}
              />)})
              ) :
              s.suppliersData && s.suppliersData.length > 0 &&
              s.suppliersData.map((data, key) => {
                return (
                  <SupplierCard
                    data={data}
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

export default CarpentrySuppliersSearchScreen;