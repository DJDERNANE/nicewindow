import React, { Component } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  View,
  Text,
  FlatList,
  Image,
} from "react-native";
import { Screen } from "../../../../components/Containers/Screen";
import { ButtonDefault } from "../../../../components/Buttons/Default";
import styles from "./styles";
import { StockCard } from "../../../../components/Cards/Stock";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SUPPLIER_API_LINK } from "../../../../utils/constants";
import { AddToStockModal } from "../../../../components/Modals/AddToStock";
import DefaultTabs from "../../../../components/Tabs/Default";
import { DefaultInput } from "../../../../components/Inputs/default";
import { json } from "react-router-dom";
import StockAvailble from "../../../../components/Cards/StockAvailble";
import i18n from "../../../../../i18n";
class StockScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stockLoading: true,
      stockData: null,

      editModalVisible: false,
      editQtyValue: 0,
      editPriceValue: 0,
      editIdValue: null,
      editType: null,
      editColor: null,
      editPrixAchat: 0,
      types: null,
      colors: null,
      activeTab: 0,
      searchText: null,
      searchResults: null,
    };
  }

  componentDidMount() {
    this.getStock();
  }

  async getStock() {
    try {
      const user = await AsyncStorage.getItem("user");

      const response = await fetch(SUPPLIER_API_LINK + "/stock", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + JSON.parse(user).api_token,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonData = await response.json();
      this.setState({
        stockData: jsonData.data,
        stockLoading: false,
      });
    } catch (error) {
      console.error("Error fetching stock:", error);
    }
  }

  handlePress(name) {
    this.props.navigation.navigate("StockArticle", { name: name });
    //console.log(name)
  }

  destroyStockConfirmation(id) {
    Alert.alert("Confirmation ", "Are you sure?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => this.destroyStock(id),
      },
    ]);
  }

  async destroyStock(id) {
    const user = await AsyncStorage.getItem("user");

    fetch(SUPPLIER_API_LINK + "/stock/destroy", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          this.getStock();
        }
      });
  }

  async updateStock() {
    const user = await AsyncStorage.getItem("user");

    fetch(SUPPLIER_API_LINK + "/stock/update", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
      body: JSON.stringify({
        id: this.state.editIdValue,
        price: this.state.editPriceValue,
        qty: this.state.editQtyValue,
        prixAchat: this.state.editPrixAchat,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          this.getStock();
          this.setState({
            editModalVisible: false,
          });
        }
      });
  }
  handleSearchTextChange(text) {
    this.setState({ searchText: text.toLowerCase() }, () => {
      this.filterData();
    });
  }

  filterData() {
    console.log(this.state.stockData);
    const filteredData = this.state.stockData.filter(
      (data) =>
        data.profile_name.toLowerCase().indexOf(this.state.searchText) !== -1
    );
    this.setState({ searchResults: filteredData });
  }

  render() {
    const s = this.state;

    return (
      <Screen>
        <ScrollView
          refreshControl={
            <RefreshControl
              onRefresh={() => this.getStock()}
              refreshing={s.stockLoading}
            />
          }
          keyboardShouldPersistTaps={"always"}
        >
          <View style={styles.container}>
            <ButtonDefault
              text={i18n.t("supplier.add")}
              onPress={() => this.props.navigation.navigate("From")}
            />
            <DefaultInput
              placeholder={"Search.."}
              value={s.searchText}
              onChangeText={(value) => this.handleSearchTextChange(value)}
            />

            <View style={styles.stockContainer}>
              {s.stockLoading ? (
                <ActivityIndicator size={"large"} />
              ) : s.searchResults && s.searchResults.length > 0 ? (
                <FlatList
                  data={s.searchResults}
                  keyExtractor={(item) => item.profile_name}
                  renderItem={({ item }) => (
                    <StockAvailble
                      handlePress={() => this.handlePress(item.profile_name)}
                      icon={item.icon}
                      profile_name={item.profile_name}
                      colors={item.colors}
                      Types={item.types}
                    />
                  )}
                />
              ) : (
                <FlatList
                  data={s.stockData}
                  keyExtractor={(item) => item.profile_name}
                  renderItem={({ item }) => (
                    <StockAvailble
                      handlePress={() => this.handlePress(item.profile_name)}
                      icon={item.icon}
                      profile_name={item.profile_name}
                      colors={item.colors}
                      Types={item.types}
                    />
                  )}
                />
              )}
            </View>
          </View>
        </ScrollView>

        <AddToStockModal
          isVisible={s.editModalVisible}
          qty={s.editQtyValue}
          price={s.editPriceValue}
          onChageQty={(value) => this.setState({ editQtyValue: value })}
          onChagePrice={(value) => this.setState({ editPriceValue: value })}
          onCancel={() => this.setState({ editModalVisible: false })}
          proTypes={s.types}
          colors={s.colors}
          prixAchat={Number(s.editPrixAchat)}
          onChagePrixAchat={(value) => this.setState({ editPrixAchat: value })}
          ItemRender={s.types}
          ColorsRender={s.colors}
          TheType={s.editType}
          TheColor={s.editColor}
        />
      </Screen>
    );
  }
}

export default StockScreen;
