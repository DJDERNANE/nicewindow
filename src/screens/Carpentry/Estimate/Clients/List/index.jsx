import React, { Component } from "react";
import { Screen } from "../../../../../components/Containers/Screen";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { TextBold } from "../../../../../components/Text";
import styles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CARPENTRY_API_LINK } from "../../../../../utils/constants";
import { PRIMARY } from "../../../../../styles/colors";
import { DefaultInput } from "../../../../../components/Inputs/default";
import i18n from "../../../../../../i18n";

class EstimateClientsListScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clientsData: null,
      clientsLoading: true,

      searchText: null,
      searchResults: null,
    };
  }

  componentDidMount() {
    this.getClients();
  }

  async getClients() {
    const user = await AsyncStorage.getItem("user");

    fetch(CARPENTRY_API_LINK + "/clients", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          clientsData: json.clients,
          clientsLoading: false,
        });
      });
  }

  handleSearchTextChange(text) {
    this.setState({ searchText: text }, () => {
      this.filterData();
    });
  }

  filterData() {
    const { clientsData, searchText } = this.state;

    const filteredData = clientsData.filter((client) =>
      client.name.toLowerCase().includes(searchText.toLowerCase())
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
              onRefresh={() => this.getClients()}
              refreshing={s.clientsLoading}
            />
          }
        >
          <View style={styles.container}>
            <View style={styles.searchView}>
              <DefaultInput
                placeholder={"Search.."}
                value={s.searchText}
                onChangeText={(value) => this.handleSearchTextChange(value)}
              />
            </View>
            <TextBold style={{ fontSize: 18, marginBottom: 6 }}>
              {i18n.t("clients.clients")}
            </TextBold>
            {s.clientsLoading ? (
              <ActivityIndicator color={PRIMARY} size={"large"} />
            ) : s.searchResults && s.searchResults.length > 0 ? (
              s.searchResults.map((data, key) => {
                return (
                  <TouchableOpacity
                    style={styles.clientView}
                    key={key}
                    onPress={() =>
                      this.props.navigation.navigate("ClientOrder", {
                        client: data,
                      })
                    }
                  >
                    <TextBold style={styles.clientNameText}>
                      {data.name}
                    </TextBold>
                  </TouchableOpacity>
                );
              })
            ) : (
              s.clientsData?.length > 0 &&
              s.clientsData.map((data, key) => {
                return (
                  <TouchableOpacity
                    style={styles.clientView}
                    key={key}
                    onPress={() =>
                      this.props.navigation.navigate("ClientOrder", {
                        client: data,
                      })
                    }
                  >
                    <TextBold style={styles.clientNameText}>
                      {data.name}
                    </TextBold>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default EstimateClientsListScreen;
