import React, { Component } from "react";
import { Screen } from "../../../components/Containers/Screen";
import { ActivityIndicator, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { TextBold, TextExtraBold, TextMedium } from "../../../components/Text";
import { Badge } from "../../../components/Badges/Default";
import { ButtonDefault } from "../../../components/Buttons/Default";
import styles from "./styles";
import { DANGER, PRIMARY, SUCCESS, WARNING } from "../../../styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CARPENTRY_API_LINK } from "../../../utils/constants";
import { UpdateSubscribtionModal } from "../../../components/Modals/UpdateSubscribtion";
import i18n from "../../../../i18n";

class SubscribtionsSettingsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subscribtionData: null,
      subscribtionLoading: true,

      updateModalShown: false,

      storeFileLoading: false,
      selectedImage: null,
      selectedDelay: 12,
      selectedPackage: null,
    };
  }

  componentDidMount() {
    this.getCurrentPackage();
  }

  async storeImage() {
    this.setState({ storeFileLoading: true });
    const user = await AsyncStorage.getItem("user");

    if (user !== null && this.state.selectedImage) {
      let formData = new FormData();

      let filename = this.state.selectedImage.split("/").pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      formData.append("proof", {
        uri: this.state.selectedImage,
        name: filename,
        type,
      });
      formData.append("delay", this.state.selectedDelay);
      formData.append("package_id", this.state.selectedPackage);

      fetch(CARPENTRY_API_LINK + "/subscribtion/store", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + JSON.parse(user).api_token,
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.success) {
            this.setState({
              storeFileLoading: false,
              updateModalShown: false,
            });
            this.getCurrentPackage();
          }
        });
    }
  }

  async pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      this.setState({
        selectedImage: result.assets[0].uri,
      });
    }
  }

  async getCurrentPackage() {
    const user = await AsyncStorage.getItem("user");

    fetch(CARPENTRY_API_LINK + "/subscribtions", {
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
          subscribtionData: json.subscribtion,
          subscribtionLoading: false,
        });
      });
  }

  render() {
    const s = this.state;

    return (
      <Screen>
        <View style={styles.container}>
          {s.subscribtionLoading ? (
            <ActivityIndicator size={"large"} color={PRIMARY} />
          ) : (
            s.subscribtionData && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <TextExtraBold style={styles.packageNameText}>
                    {i18n.language === "ar"
                      ? s.subscribtionData.package?.name_ar.toUpperCase()
                      : s.subscribtionData.package?.name_en.toUpperCase()}
                  </TextExtraBold>
                  {s.subscribtionData.status === 0 ? (
                    <Badge color={WARNING}>
                      {i18n.t("status.subscribtions.waiting")}
                    </Badge>
                  ) : s.subscribtionData.status === 1 ? (
                    <Badge color={SUCCESS}>
                      {i18n.t("status.subscribtions.active")}
                    </Badge>
                  ) : (
                    <Badge color={DANGER}>
                      {i18n.t("status.subscribtions.expired")}
                    </Badge>
                  )}
                </View>
                <View style={styles.cardBody}>
                  <TextBold style={styles.cardBodyText}>
                    {i18n.t("settings.subscribtions.start")}:{" "}
                    <TextMedium>{s.subscribtionData.start}</TextMedium>
                  </TextBold>
                  <TextBold style={styles.cardBodyText}>
                    {i18n.t("settings.subscribtions.end")}:{" "}
                    <TextMedium>{s.subscribtionData.end}</TextMedium>
                  </TextBold>
                </View>
                {s.subscribtionData.status > 1 && (
                  <View style={styles.cardFooter}>
                    <ButtonDefault
                      text={i18n.t("settings.subscribtions.button")}
                      size={"md"}
                      color={PRIMARY}
                      onPress={() => this.setState({ updateModalShown: true })}
                    />
                  </View>
                )}
              </View>
            )
          )}
        </View>

        <UpdateSubscribtionModal
          isVisible={s.updateModalShown}
          onCancel={() => this.setState({ updateModalShown: false })}
          onPickImage={() => this.pickImage()}
          onSend={() => this.storeImage()}
          image={s.selectedImage}
          selectedDelay={s.selectedDelay}
          onDelayChange={(delay) => this.setState({ selectedDelay: delay })}
          selectedPackage={s.selectedPackage}
          onPackageChange={(package_id) =>
            this.setState({ selectedPackage: package_id })
          }
        />
      </Screen>
    );
  }
}

export default SubscribtionsSettingsScreen;
