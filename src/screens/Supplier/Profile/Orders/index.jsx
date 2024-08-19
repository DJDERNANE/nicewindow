import React, { useState, useEffect, useCallback } from "react";
import { Screen } from "../../../../components/Containers/Screen";
import { ActivityIndicator, ScrollView, View, Alert } from "react-native";
import styles from "./styles";
import { LIGHT, PRIMARY } from "../../../../styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SUPPLIER_API_LINK } from "../../../../utils/constants";
import { OrderCard } from "../../../../components/Cards/Order";
import DefaultTabs from "../../../../components/Tabs/Default";
import { ButtonDefault } from "../../../../components/Buttons/Default";
import { useNavigation } from "@react-navigation/native";
import { DefaultInput } from "../../../../components/Inputs/default";
import i18n from "../../../../../i18n";

const ProfileSupplierOrdersScreen = () => {
  const navigation = useNavigation();

  const [ordersData, setOrdersData] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [moreOrdersLoading, setMoreOrdersLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [inFavorite, setInFavorite] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    getOrders();
  }, []);

  const onChangeTab = useCallback((tab) => {
    setActiveTab(tab);
    setPage(1);
    setOrdersData(null);
    getOrders();
  }, []);

  const getOrders = async () => {
    setOrdersLoading(true);
    const user = await AsyncStorage.getItem("user");
    const LINK =
      activeTab === 0
        ? SUPPLIER_API_LINK + "/orders?page=" + page
        : SUPPLIER_API_LINK + "/orders/histories?page=" + page;

    fetch(LINK, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setOrdersData((prevData) =>
          prevData
            ? { ...prevData, data: [...prevData.data, ...json.orders.data] }
            : json.orders
        );
        setOrdersLoading(false);
        setMoreOrdersLoading(false);
      });
  };

  const handleScroll = useCallback(
    (event) => {
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;
      const isEndReached =
        contentOffset.y >= contentSize.height - layoutMeasurement.height - 100;
      if (isEndReached && !moreOrdersLoading && ordersData.last_page > page) {
        setPage(page + 1);
        setMoreOrdersLoading(true);
        getOrders();
      }
    },
    [getOrders, moreOrdersLoading, ordersData, page]
  );

  const addToFavorite = useCallback(async (value) => {
    const user = await AsyncStorage.getItem("user");
    fetch(SUPPLIER_API_LINK + "/clients/favorite/store", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
      body: JSON.stringify({
        client_id: value,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          setInFavorite((prevInFavorite) => !prevInFavorite);
        }
      });
  }, []);

  const handleSearchTextChange = (text) => {
    setSearchText(text.toLowerCase());
  };

  const search = async () => {
    const user = await AsyncStorage.getItem("user");
    await fetch(SUPPLIER_API_LINK + "/order/search?query=" + searchText, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setSearchResults(json.orders.data);
      });
  };

  useEffect(() => {
    search();
  }, [searchText]);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        onScroll={handleScroll}
      >
        <View style={[styles.container, { backgroundColor: LIGHT }]}>
          <DefaultTabs
            tabs={["Active", "Histories"]}
            activeTab={activeTab}
            onChangeTab={(tab) => onChangeTab(tab)}
          />
          <View style={styles.searchView}>
            <DefaultInput
              placeholder={"Search.."}
              value={searchText}
              onChangeText={(value) => handleSearchTextChange(value)}
            />
          </View>

          <ButtonDefault
            text={i18n.t("supplier.addNewOrder")}
            onPress={() => navigation.navigate("SupplierProducts")}
            size={"sm"}
          />

          {ordersLoading ? (
            <ActivityIndicator color={PRIMARY} size={"large"} />
          ) : searchResults && searchResults.length > 0 ? (
            searchResults.map((data, key) => {
              return (
                <OrderCard
                  id={data.id}
                  key={key}
                  date={data.created_at}
                  price={data.total_price}
                  client_name={
                    data.carpentry.firstname + " " + data.carpentry.lastname
                  }
                  status={data.status}
                  inFavorite={inFavorite}
                  addToFavorite={() => addToFavorite(data.carpentry.id)}
                />
              );
            })
          ) : (
            ordersData &&
            ordersData.data &&
            ordersData.data.length > 0 &&
            ordersData.data.map((data, key) => {
              return (
                <OrderCard
                  id={data.id}
                  key={key}
                  date={data.created_at}
                  price={data.total_price}
                  client_name={
                    data.carpentry.firstname + " " + data.carpentry.lastname
                  }
                  status={data.status}
                  inFavorite={inFavorite}
                  addToFavorite={() => addToFavorite(data.carpentry.id)}
                />
              );
            })
          )}
        </View>
      </ScrollView>
    </Screen>
  );
};

export default ProfileSupplierOrdersScreen;
