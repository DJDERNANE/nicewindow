import React, { Component } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View, FlatList } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Screen } from "../../../../components/Containers/Screen";
import { TextBold } from "../../../../components/Text";
import styles from "./styles";
import { SupplierStockCard } from "../../../../components/Cards/Carpentry/SupplierStock";
import { CARPENTRY_API_LINK } from "../../../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DANGER, PRIMARY, SUCCESS, WARNING } from "../../../../styles/colors";
import { DefaultAlert } from "../../../../components/Alerts/Default";
import { SendProfileOrderModal } from "../../../../components/Modals/SendProfileOrder";
import { CartHeader } from "../../../../components/Header/Cart";
import SupplierStock from "../../../../components/Cards/Carpentry/SupplierStock";
import { DefaultInput } from "../../../../components/Inputs/default";
import { AddtoCart } from "../../../../components/Modals/AddtoCart";
class SupplierProductsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screenData: null,

      profilesData: null,
      profilesLoading: true,

      alertText: null,
      alertType: SUCCESS,

      inFavorite: false,

      selectedProfileId: null,
      selectedProfilePrice: null,
      selectedProfileQty: '1',
      selectedSupplierId: null,

      cartItemsCount: 0,
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
  componentDidMount() {
    this.checkCartCount();
    this.setScreenData();
    this.checkFavorite();
  }

  setHeader() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <CartHeader count={this.state.cartItemsCount} supplier={this.state.screenData.id} />
      )
    });
  }

  async checkCartCount() {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK+'/cart/count', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ JSON.parse(user).api_token
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

  setScreenData() {
    if(this.props.route.params && this.props.route.params.data)
    {
      this.setState({
        screenData: this.props.route.params.data
      }, () => {
        this.getSupplierProfiles();
      });
    }
  }

  async getSupplierProfiles() {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK+'/supplier/profile/stock', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ JSON.parse(user).api_token
      },
      body: JSON.stringify({
        supplier_id: this.state.screenData.id
      })
    })
    .then((response) => response.json())
    .then((json) => {
      //console.log(json)
      this.setState({
        profilesData: json.data,
       
        profilesLoading: false
      });
      
    })
  }

  async addToFavorite() {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK+'/supplier/favorite/store', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ JSON.parse(user).api_token
      },
      body: JSON.stringify({
        supplier_id: this.state.screenData.id
      })
    })
    .then((response) => response.json())
    .then((json) => {
      if(json.success)
      {
        this.setState({
          inFavorite: !this.state.inFavorite
        });
      }
    })
  }

  async checkFavorite() {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK+'/supplier/favorite/check', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ JSON.parse(user).api_token
      },
      body: JSON.stringify({
        supplier_id: this.state.screenData.id
      })
    })
    .then((response) => response.json())
    .then((json) => {
      if(json.success)
      {
        this.setState({
          inFavorite: true
        });
      }
    })
  }

  async AddToCart() {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK+'/cart/store', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ JSON.parse(user).api_token
      },
      body: JSON.stringify({
        supplier_id: this.state.screenData.id,
        profile_id: this.state.selectedProfileId,
        qty: this.state.selectedProfileQty
      })
    })
    .then((response) => response.json())
    .then((json) => {
      if(json.success)
      {
        
        this.setState({
          selectedProfileId: null,
          cartItemsCount: this.state.cartItemsCount+1
        }, () => {
          this.setHeader();
        });
      }
      else
      {
        this.setState({
          alertType: DANGER,
          alertText: json.message
        });
      }

      this.getSupplierProfiles();
    })
  }

  handleSearchTextChange(text) {

    this.setState({ searchText: text.toLowerCase() }, () => {
      this.filterData();
    });
  }

  filterData() {
    const filteredData = this.state.profilesData.filter(data =>
      data.profile_name.toLowerCase().indexOf(this.state.searchText) !== -1
    );
    this.setState({ searchResults: filteredData });
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
          supplier_id: this.state.screenData.id
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
    return(
      <Screen>
        {s.alertText &&
          <DefaultAlert type={s.alertType} alertClose={() => this.setState({alertText: null})}>
            {s.alertText}
          </DefaultAlert>
        }
        <ScrollView 
          keyboardShouldPersistTaps={'always'}
          refreshControl={
            <RefreshControl 
              onRefresh={() => this.getSupplierProfiles()}
              refreshing={s.profilesLoading}
            />
          }
        >
          <View style={styles.container}>
          <DefaultInput
              placeholder={'Search..'}
              value={s.searchText}
              onChangeText={(value) => this.handleSearchTextChange(value)}
            />
            <View style={styles.header}>
              <TextBold style={styles.supplierNameText}>{s.screenData && s.screenData.firstname+' '+s.screenData.lastname}</TextBold>
              <AntDesign name={s.inFavorite ? 'star' : 'staro'} color={WARNING} size={20} onPress={() => this.addToFavorite()} />
            </View>
            {s.profilesLoading ?
              <ActivityIndicator color={PRIMARY} size={'large'} />
              :
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
                        types: item.types
                      })}
                    />
                  )}
                />
              ) :(
              <FlatList
              data={s.profilesData}
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
            )
              
            
            }

            {/*s.selectedProfileId &&
              <SendProfileOrderModal 
                isVisible={true}
                onCancel={() => this.setState({selectedProfileId: null})}
                qty={s.selectedProfileQty}
                onChageQty={(value) => this.setState({selectedProfileQty: value})}
                totalPrice={Number(s.selectedProfilePrice)*Number(s.selectedProfileQty)}
                onSend={() => this.AddToCart()}
              />
          */}
          </View>
          <AddtoCart
            isVisible={s.addTocartVisible}
            onCancel={()=>this.setState({addTocartVisible: false})}
            Types={s.types}
            colors={s.colors}
            qty={s.selectedProfileQty}
            maxQty={s.qty}
            price={s.selectedProfilePrice}
            onChageQty={(value)=> this.setState({selectedProfileQty:value})}
            profile_name={s.profilename}
            selectedColor={s.selectedColor}
            selectedOption={s.selectedOption}
            handleColorPress={(color) => this.handleColorPress(color)}
            handleTypePress={(type) => this.handleTypePress(type)}
            totalPrice={Number(s.selectedProfilePrice)*Number(s.selectedProfileQty)}
            onAdd={() => this.AddToCart()}
            />
        </ScrollView>
      </Screen>
    );
  }
}

export default SupplierProductsScreen;