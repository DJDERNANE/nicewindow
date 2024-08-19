import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, ActivityIndicator, Text } from 'react-native';
import { Screen } from '../../../../components/Containers/Screen';
import { ButtonDefault } from '../../../../components/Buttons/Default';
import styles from './styles';
import { ClientCard } from '../../../../components/Cards/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPPLIER_API_LINK } from '../../../../utils/constants';
import AddClient from '../../../../components/Modals/AddClient';
import { DANGER, SUCCESS, PRIMARY } from '../../../../styles/colors';
import DefaultTabs from '../../../../components/Tabs/Default';
import { useNavigation } from '@react-navigation/native';
import { DefaultInput } from "../../../../components/Inputs/default";
import i18n from '../../../../../i18n';

const ClientsScreen = () => {
  const navigation = useNavigation();
  const [clientLoading, setClientLoading] = useState(true);
  const [addClientModal, setAddClientModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [name, setName] = useState('');

  const [email, setEmail] = useState('');
  const [clients, setClients] = useState([]);
  const [phone, setPhone] = useState('');
  const [company_name, setCompanyName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState();

  useEffect(() => {
    getClients();
  }, [activeTab]);

  const onChangeTab = (tab) => {
    setActiveTab(tab);
    setClients(null);
    getClients();
  };

  const getClients = async () => {
    const LINK =
      activeTab === 0 ? SUPPLIER_API_LINK + '/clients' : SUPPLIER_API_LINK + '/favoris';
    try {
      const user = await AsyncStorage.getItem('user');

      const response = await fetch(LINK, {
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
      setClients(jsonData.res);
      setClientLoading(false);
    } catch (error) {
      console.error('Error fetching stock:', error);
    }
  };

  const createClient = async () => {
    const user = await AsyncStorage.getItem('user');

    fetch(SUPPLIER_API_LINK + '/user/store', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + JSON.parse(user).api_token,
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        company_name,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (json.success) {
          setAddClientModal(false);
          getClients();
        }
      });
  };

  const deleteClient = async (value) => {
    const user = await AsyncStorage.getItem('user');

    fetch(SUPPLIER_API_LINK + '/user/delete', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + JSON.parse(user).api_token,
      },
      body: JSON.stringify({
        user_id: value,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (json.success) {
          getClients();
        }
      });
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text.toLowerCase());
  }
  const filterData = async() => {
    const filteredData = await clients.filter(profile =>
            profile.firstname.toLowerCase().includes(searchText)
        );
    setSearchResults(filteredData)
  }
  useEffect(() => {
    filterData();
  }, [searchResults]);
  
  return (
    <Screen>
      <Screen
        refreshControl={
          <RefreshControl onRefresh={getClients} refreshing={clientLoading} />
        }
        contentContainerStyle={{ flex: 1 }}
        keyboardShouldPersistTaps={'always'}
      >
        <DefaultTabs
          tabs={[i18n.t('supplier.myclients'), i18n.t('supplier.favoris') ]}
          activeTab={activeTab}
          onChangeTab={(tab) => onChangeTab(tab)}
        />
        <View style={styles.searchView}>
          <DefaultInput
            placeholder={'Search..'}
            value={searchText}
            onChangeText={(value) => handleSearchTextChange(value)}
          />
        </View>

        {activeTab === 0 ? (
          <View style={styles.container}>
            <ButtonDefault
              text={ i18n.t('supplier.addnewclient') }
              onPress={() => setAddClientModal(true)}
              size={'sm'}
            />
          </View>
        ) : null}

        <ScrollView style={styles.container}>
          {clientLoading ? (
            <ActivityIndicator color={PRIMARY} size={'large'} />
          ) :
            searchResults && searchResults.length > 0 ?
              searchResults.map((data, key) =>(
                <ClientCard
                  data={data}
                  key={key}
                  activeTab={activeTab}
                  onDestroy={() => deleteClient(data.id)}
                  clientDetails={() => navigation.navigate('clienthistory', { clientId: data.id })}
                />
              ))
              : clients && clients.length > 0 ? (
                clients.map((data, key) => (
                  <ClientCard
                    data={data}
                    key={key}
                    activeTab={activeTab}
                    onDestroy={() => deleteClient(data.id)}
                    clientDetails={() => navigation.navigate('clienthistory', { clientId: data.id })}
                  />
                ))
              ) : (
                <Text>No clients available</Text>
              )}
        </ScrollView>
      </Screen>

      <AddClient
        isVisible={addClientModal}
        onCancel={() => setAddClientModal(false)}
        name={name}
        email={email}
        phone={phone}
        company={company_name}
        onChangeName={(value) => setName(value)}
        onChangeEmail={(value) => setEmail(value)}
        onChangePhone={(value) => setPhone(value)}
        onChangeCompany={(value) => setCompanyName(value)}
        onConfirm={createClient}
      />
    </Screen>
  );
};

export default ClientsScreen;
