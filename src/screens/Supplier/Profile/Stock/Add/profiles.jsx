import React, { Component, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View ,TouchableOpacity, Text} from "react-native";
import { Screen } from "../../../../../components/Containers/Screen";
import { SUPPLIER_API_LINK } from "../../../../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles";
import { ProfileCard } from "../../../../../components/Cards/Profile";
import { AddToStockModal } from "../../../../../components/Modals/AddToStock";
import { DefaultAlert } from "../../../../../components/Alerts/Default";
import { DANGER, SUCCESS } from "../../../../../styles/colors";
import { DefaultInput } from "../../../../../components/Inputs/default";
import Radiostyles from "../../../../../components/Modals/style";
import { CheckBox } from 'react-native-elements';

class AddStockProfilesScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      
      profilesData: null,
      profilesLoading: true,

      addToStockModalVisible: false,

      selectedStockId: null,
      selectedQty: 0,
      selectedPrice: 0,

      selectedPrixAchat: 0,
      alertText: null,
      alertType: SUCCESS,

      searchText: null,
      searchResults: null,

      types: null,
      colors: null,
      selectedOption: null,
      checkedItems:null
    }
  }



  componentDidMount() {
    this.getProfiles();
  }

  async getProfiles() {
    const user = await AsyncStorage.getItem('user');

    fetch(SUPPLIER_API_LINK + '/profiles/' + this.props?.route?.params?.subcategory, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      }
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        this.setState({
          profilesData: json.profiles,
          types: json.types,
          colors: json.colors,
          profilesLoading: false
        });
      })
  }

  async addToStock() {
    const user = await AsyncStorage.getItem('user');

    fetch(SUPPLIER_API_LINK + '/stock/store', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        profile_id: this.state.selectedStockId,
        price: this.state.selectedPrice,
        prixAchat: this.state.selectedPrixAchat,
        qty: this.state.selectedQty,
        typeId: this.state.selectedOption,
        colorId: this.state.checkedItems
      })
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (json.success) {
          this.setState({
            alertText: 'Data successfuly added.'
          }, () => {
            this.getProfiles();
          });
        }
        else {
          this.setState({
            alertText: 'Something wrong.',
            alertType: DANGER
          });
        }

        this.setState({
          addToStockModalVisible: false,
          selectedStockId: null,
          selectedPrice: 0,
          selectedPrixAchat: 0,
          selectedQty: 0,
        });
      })
  }

  handleSearchTextChange(text) {
    this.setState({ searchText: text }, () => {
      this.filterData();
    });
  }

  filterData() {
    const { profilesData, searchText } = this.state;

    const filteredData = profilesData.filter((profile) =>
      profile.name.toLowerCase().includes(searchText.toLowerCase())
    );

    this.setState({ searchResults: filteredData });
  }

  handleOptionSelect(option) {
    this.setState({
      selectedOption: option
    });
    
  }

  handleCheck = (item) => {
    this.setState({
      checkedItems: item
    });
  };
  
  async getTypes(idProfile) {
    const user = await AsyncStorage.getItem('user');

    fetch(SUPPLIER_API_LINK + '/profiles/types', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        id: idProfile
      })
    })
      .then((response) => response.json())
      .then((json) => {
        //console.log(json)
        this.setState({
          types: json.types,
        });
      })
  }
 

  render() {
    const s = this.state;
    
    const  renderItem = ({ item }) => {
      return (
        <View>
          <TouchableOpacity
            style={[
              Radiostyles.option,
              s.selectedOption === item.id && Radiostyles.selectedOption,
            ]}
            onPress={() => this.handleOptionSelect(item.id)}
          >
            <Text style={Radiostyles.optionText}>{item.name}</Text>
          </TouchableOpacity>
        </View>
      )
  
    };

    const renderColor = ({item}) =>{return(
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
      style={[
        { backgroundColor: item.color_code },
        Radiostyles.color,
        s.checkedItems === item.id && Radiostyles.colorselected,
      ]}
       
        onPress={() => this.handleCheck(item.id)}
      >
        <Text style={Radiostyles.optionText}>{item.name}</Text>
      </TouchableOpacity>
    </View>
     )}

    return (
      <Screen>
        {s.alertText &&
          <DefaultAlert alertClose={() => this.setState({ alertText: null })} type={s.alertType}>
            {s.alertText}
          </DefaultAlert>
        }
        <ScrollView
          keyboardShouldPersistTaps={'always'}
        >
          <View style={styles.container}>
            <View style={styles.searchView}>
              <DefaultInput
                placeholder={'Search..'}
                value={s.searchText}
                onChangeText={(value) => this.handleSearchTextChange(value)}
              />
            </View>

            {s.profilesLoading ?
              <ActivityIndicator size={'large'} />
              :
              s.searchResults && s.searchResults.length > 0 ?
                s.searchResults.map((data, key) => {
                  return (
                    <ProfileCard
                      key={key}
                      data={data}
                      onAddToStock={() => this.setState({ addToStockModalVisible: true, selectedStockId: data.id })}
                    />
                  );
                })
                :
                s.profilesData && s.profilesData.length > 0 &&
                s.profilesData.map((data, key) => {
                  return (
                    <ProfileCard
                      key={key}
                      data={data}
                      onAddToStock={() => {
                        this.getTypes(data.id)
                        this.setState({ addToStockModalVisible: true, selectedStockId: data.id })
                      }}
                    />
                  );
                })
            }

            <AddToStockModal
              isVisible={s.addToStockModalVisible}
              qty={s.selectedQty}
              proTypes={s.types}
              colors={s.colors}
              price={Number(s.selectedPrice)}
              prixAchat={Number(s.selectedPrixAchat)}
              onCancel={() => this.setState({ addToStockModalVisible: false })}
              onAdd={() => this.addToStock()}
              onChageQty={(value) => this.setState({ selectedQty: value })}
              onChagePrice={(value) => this.setState({ selectedPrice: value })}
              onChagePrixAchat={(value) => this.setState({ selectedPrixAchat: value })}
              ItemRender={renderItem}
              ColorsRender={renderColor}
            />
          </View>

        </ScrollView>
      </Screen>
    );
  }
}

export default AddStockProfilesScreen;