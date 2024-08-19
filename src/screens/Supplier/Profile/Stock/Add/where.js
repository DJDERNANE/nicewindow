import React, { Component } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SUPPLIER_API_LINK } from "../../../../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ButtonDefault } from "../../../../../components/Buttons/Default";
import { Screen } from "../../../../../components/Containers/Screen";
import styles from "./styles";
import i18n from "../../../../../../i18n";

class WhereScreen extends Component {
  render() {
    return (
      <Screen>
        <ScrollView>
          <View style={styles.container}>
            <ButtonDefault
              text={i18n.t("supplier.from_database")}
              onPress={() =>
                this.props.navigation.navigate("AddStockCategories")
              }
              containerStyle={{ marginBottom: 20 }}
            />
            <ButtonDefault
              text={i18n.t("supplier.myproducts")}
              onPress={() => this.props.navigation.navigate("myproducts")}
              containerStyle={{ marginBottom: 20 }}
            />
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default WhereScreen;
