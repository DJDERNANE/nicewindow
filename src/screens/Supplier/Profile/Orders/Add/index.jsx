import React, { Component } from "react";
import { Screen } from "../../../../../components/Containers/Screen";
import { ActivityIndicator, ScrollView, View, Alert, Text, RefreshControl, FlatList } from "react-native";
import { SupplierCartHeader } from "../../../../../components/Header/SupplierCart";
import { SUPPLIER_API_LINK } from "../../../../../utils/constants";

import styles from "../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SupplierStockCard } from "../../../../../components/Cards/Carpentry/SupplierStock";
import { SendProfileOrderModal } from "../../../../../components/Modals/SendProfileOrder";
import { CARPENTRY_API_LINK } from "../../../../../utils/constants";
import SupplierStock from "../../../../../components/Cards/Carpentry/SupplierStock";
import { AddtoCart } from "../../../../../components/Modals/AddtoCart";
import i18n from "../../../../../../i18n";
class SupplierProductsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stockData: null,
      stockLoading: true,
      selectedProfileId: null,
      selectedProfilePrice: null,
      selectedSupplierId: null,
      selectedProfileQty: 0,
      cartItemsCount: 0,
      AddCart: false,
      searchText: null,
      searchResults: null,
      addTocartVisible: false,
      colors: [],
      types: [],
      qty: 0,
      profilename: null,
      selectedColor:null,
      selectedOption: null,
    }
  }

  componentDidMount() {
    this.getStock();
  }

  setHeader() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <SupplierCartHeader count={this.state.cartItemsCount} supplier={this.state.selectedSupplierId} />
      )
    });
  }

  async getStock() {

    try {
      const user = await AsyncStorage.getItem('user');

      const response = await fetch(SUPPLIER_API_LINK + '/stock', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + JSON.parse(user).api_token,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const jsonData = await response.json();
      this.setState({
        stockData: jsonData.data,
        stockLoading: false,
        selectedSupplierId: jsonData.id
      })

      this.setHeader();

    } catch (error) {
      console.error('Error fetching stock:', error);
    }
  }
  async AddToCart() {
    this.setState({ AddCart: false, addTocartVisible:false })
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK + '/cart/store', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        supplier_id: this.state.selectedSupplierId,
        profile_id: this.state.selectedProfileId,
        qty: this.state.selectedProfileQty
      })
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        if (json.success) {
          this.setState({
            selectedProfileId: null,
            cartItemsCount: this.state.cartItemsCount + 1,

          }, () => {
            this.setHeader();
          });
        }


        this.getStock();
      })

  }

  async getQtyPrice(){
    
    const user = await AsyncStorage.getItem('user');
     if (this.state.selectedColor && this.state.selectedOption) {
      //console.log(`${CARPENTRY_API_LINK}/supplier/profile/qtePrice?color=${this.state.selectedColor}&&type=${this.state.selectedOption}`)
      fetch(`${CARPENTRY_API_LINK}/supplier/profile/qtePrice`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + JSON.parse(user).api_token
        },
        body: JSON.stringify({
          color: this.state.selectedColor,
          type: this.state.selectedOption,
          supplier_id: null
        })
      })
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          if (json.data) {
            this.setState({
              selectedProfileId: json.data.profile_id,
              qty: json.data.qty,
              selectedProfilePrice: json.data.price
            })
          }else{
            this.setState({
              selectedProfileId: null,
              qty: null,
              selectedProfilePrice: null
            })
          }
        
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      
    }
   
  }

  async checkCartCount() {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK + '/cart/count', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        supplier_id: this.state.screenData.id
      })
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          cartItemsCount: json.cart
        }, () => {
          this.setHeader();
        });
      })
  }
  handleColorPress(color)  {
    this.setState({
      selectedColor: color
    })
    
  };
  handleTypePress(type)  {
    this.setState({
      selectedOption: type
    })
  };

  componentDidUpdate(prevProps, prevState) {
    // Check if either selectedOption or selectedColor has changed
    if (
      this.state.selectedOption !== prevState.selectedOption ||
      this.state.selectedColor !== prevState.selectedColor
    ) {
      this.getQtyPrice();
    }
  }

  render() {
    const s = this.state;
    console.log(s.selectedSupplierId)
    return (
      <Screen>

        <ScrollView
          refreshControl={
            <RefreshControl
              onRefresh={() => this.getStock()}
              refreshing={s.stockLoading}
            />
          }
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps={'always'}
        >
          <View style={[styles.container, { backgroundColor: '#e4e4e4' }]}>


            <View style={styles.stockContainer}>
              {s.stockLoading ? (
                <ActivityIndicator size={'large'} />
              ) :
                s.searchResults && s.searchResults.length > 0 ?
                  (<FlatList
                    data={s.searchResults}
                    keyExtractor={(item) => item.profile_name}
                    renderItem={({ item }) => (
                      <SupplierStock
                        icon={item.icon}
                        profile_name={item.profile_name}
                        colors={item.colors}
                        Types={item.types}
                        onAddtocart={() => this.setState({
                          addTocartVisible: true,
                          colors: item.colors,
                          types: item.types,
                          profilename: item.profile_name,
                        })}
                      />
                    )}
                  />
                  ) : (
                    <FlatList
                      data={s.stockData}
                      keyExtractor={(item) => item.profile_name}
                      renderItem={({ item }) => (
                        <SupplierStock
                          icon={item.icon}
                          profile_name={item.profile_name}
                          colors={item.colors}
                          Types={item.types}
                          onAddtocart={() => this.setState({
                            addTocartVisible: true,
                            colors: item.colors,
                            types: item.types,
                            profilename: item.profile_name,
                          })}
                        />
                      )}
                    />
                  )}
            </View>

          </View>

          {/*s.selectedProfileId &&
            <SendProfileOrderModal
              isVisible={s.AddCart}
              onCancel={() => this.setState({ selectedProfileId: null })}
              qty={s.selectedProfileQty}
              onChageQty={(value) => this.setState({ selectedProfileQty: value })}
              totalPrice={Number(s.selectedProfilePrice) * Number(s.selectedProfileQty)}
              onSend={() => this.AddToCart()}
            />
                    */}
          <AddtoCart
            isVisible={s.addTocartVisible}
            onCancel={() => this.setState({ addTocartVisible: false })}
            Types={s.types}
            colors={s.colors}
            qty={s.selectedProfileQty}
            maxQty={s.qty}
            price={s.selectedProfilePrice}
            onChageQty={(value) => this.setState({ selectedProfileQty: value })}
            profile_name={s.profilename}
            selectedColor={s.selectedColor}
            selectedOption={s.selectedOption}
            handleColorPress={(color) => this.handleColorPress(color)}
            handleTypePress={(type) => this.handleTypePress(type)}
            totalPrice={Number(s.selectedProfilePrice) * Number(s.selectedProfileQty)}
            onAdd={() => this.AddToCart()}
          />
        </ScrollView>

      </Screen>
    );
  }
}

export default SupplierProductsScreen;