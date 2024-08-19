import React, { Component } from "react";
import { Screen } from "../../../../components/Containers/Screen";
import { ScrollView, View } from "react-native";
import { Label } from "../../../../components/Forms/Label";
import { DefaultInput } from "../../../../components/Inputs/default";
import styles from "./styles";
import { ButtonDefault } from "../../../../components/Buttons/Default";
import DateTimeInput from "../../../../components/Inputs/date";
import { CARPENTRY_API_LINK } from "../../../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DefaultAlert } from "../../../../components/Alerts/Default";
import { DANGER } from "../../../../styles/colors";
import i18n from "../../../../../i18n";

class AddAppointmentScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      alertText: null,

      client_name: null,
      client_mobile: null,
      date: new Date(),
      time: new Date(),
      label: null,
    };
  }

  handleChange(name, value) {
    this.setState({
      ...this.state,
      [name]: value,
    });
  }

  async store() {
    this.setState({ isLoading: true });
    const user = await AsyncStorage.getItem("user");

    fetch(CARPENTRY_API_LINK + "/appointment/store", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
      body: JSON.stringify({
        client_name: this.state.client_name,
        client_mobile: this.state.client_mobile,
        date: this.state.date,
        time: this.state.time,
        lable: this.state.label,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          this.setState({ isLoading: false });
          this.props.navigation.navigate("Appointments");
        } else {
          this.setState({
            isLoading: false,
            alertText: json.message,
          });
        }
      });
  }

  render() {
    const s = this.state;

    return (
      <Screen>
        <ScrollView keyboardShouldPersistTaps={"handled"}>
          {s.alertText && (
            <DefaultAlert
              type={DANGER}
              alertClose={() => this.setState({ alertText: null })}
            >
              {s.alertText}
            </DefaultAlert>
          )}
          <View style={styles.container}>
            <View style={styles.formGroup}>
              <Label required>
                {i18n.t("appointments.labels.client_name")}:{" "}
              </Label>
              <DefaultInput
                onChangeText={(value) =>
                  this.handleChange("client_name", value)
                }
                value={s.client_name}
              />
            </View>
            <View style={styles.formGroup}>
              <Label required>
                {i18n.t("appointments.labels.client_mobile")}:{" "}
              </Label>
              <DefaultInput
                onChangeText={(value) =>
                  this.handleChange("client_mobile", value)
                }
                value={s.client_mobile}
              />
            </View>
            <View style={styles.formGroup}>
              <Label required>{i18n.t("appointments.labels.date")}: </Label>
              <DateTimeInput
                mode="date"
                date={s.date}
                onChange={(date) => this.handleChange("date", date)}
              />
            </View>
            <View style={styles.formGroup}>
              <Label required>{i18n.t("appointments.labels.time")}: </Label>
              <DateTimeInput
                mode="time"
                date={s.time}
                onChange={(time) => this.handleChange("time", time)}
              />
            </View>
            <View style={styles.formGroup}>
              <Label>{i18n.t("appointments.labels.label")}: </Label>
              <DefaultInput
                onChangeText={(value) => this.handleChange("label", value)}
                value={s.label}
              />
            </View>
            <View style={styles.formGroup}>
              <ButtonDefault
                text={i18n.t("appointments.buttons.save")}
                onPress={() => this.store()}
              />
            </View>
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default AddAppointmentScreen;
