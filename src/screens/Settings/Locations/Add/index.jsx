import React, { Component } from "react";
import { View } from "react-native";
import { Screen } from "../../../../components/Containers/Screen";
import LocationInput from "../../../../components/Inputs/location";
import { ButtonDefault } from "../../../../components/Buttons/Default";
import styles from "./styles";
import { API_LINK } from "../../../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Label } from "../../../../components/Forms/Label";
import { DefaultInput } from "../../../../components/Inputs/default";
import { DefaultAlert } from "../../../../components/Alerts/Default";
import { DANGER } from "../../../../styles/colors";
import i18n from "../../../../../i18n";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import axios from "axios";

class AddLocationScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: null,
      responsible_name: null,
      responsible_mobile: null,
      isLoading: false,
      alertText: null,
      alertType: DANGER,
      currentLocation: null,
    };
  }

  async store() {
    this.setState({ isLoading: true });
    const user = await AsyncStorage.getItem("user");

    fetch(API_LINK + "/location/store", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
      body: JSON.stringify({
        address: this.state.address,
        responsible_name: this.state.responsible_name,
        responsible_mobile: this.state.responsible_mobile,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (json.success) {
          this.props.navigation.navigate("LocationsSettings");
        }
        this.setState({
          isLoading: false,
          alertText: json.message,
        });
      });
  }

  render() {
    const s = this.state;
    return (
      <Screen>
        {s.alertText && (
          <DefaultAlert
            type={s.alertType}
            alertClose={() => this.setState({ alertText: null })}
          >
            {s.alertText}
          </DefaultAlert>
        )}
        <View style={styles.container}>
          <View style={styles.formGroup}>
            <Label required>
              {i18n.t("settings.locations.labels.address")}:{" "}
            </Label>
            <LocationInput
              onPress={(address) =>
                this.setState({ address: address.description })
              }
              detectLocation={() => console.log("ok")}
            />
          </View>
          <View style={styles.formGroup}>
            <Label required>
              {i18n.t("settings.locations.labels.responsible_name")}:{" "}
            </Label>
            <DefaultInput
              onChangeText={(value) =>
                this.setState({ responsible_name: value })
              }
              value={s.responsible_name}
            />
          </View>
          <View style={styles.formGroup}>
            <Label required>
              {i18n.t("settings.locations.labels.responsible_mobile")}:{" "}
            </Label>
            <DefaultInput
              onChangeText={(value) =>
                this.setState({ responsible_mobile: value })
              }
              value={s.responsible_mobile}
            />
          </View>

          <ButtonDefault
            text={i18n.t("settings.locations.buttons.save")}
            onPress={() => this.store()}
            loading={this.state.isLoading}
          />
        </View>
      </Screen>
    );
  }
}

export default AddLocationScreen;
