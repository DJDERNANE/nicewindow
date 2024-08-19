import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { PRIMARY } from "../styles/colors";
import { DANGER } from "../styles/colors";
import { ButtonDefault } from "./Buttons/Default";
import { DefaultInput } from "../components/Inputs/default";
import { CARPENTRY_API_LINK } from "../utils/constants";
import { TextExtraBold, TextMedium } from "./Text";
import { useSSR } from "react-i18next";

const VolleTab = () => {
  const [volles, setVolles] = useState([]);
  const [visible, setVisibe] = useState(false);
  const [updateVisible, setUpdateVisibe] = useState(false);
  const [vls, setVls] = useState(null);

  async function getVolles() {
    const user = await AsyncStorage.getItem("user");

    fetch(CARPENTRY_API_LINK + "/volles", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          setVolles(json.data);
        }
      });
  }
  useEffect(() => {
    getVolles();
  }, []);

  async function addVolle(name, coloredPrice) {
    const user = await AsyncStorage.getItem("user");

    fetch(CARPENTRY_API_LINK + "/volle/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
      body: JSON.stringify({
        name: name,
        price: coloredPrice,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          getVolles();
          setVisibe(false);
        }
      });
  }

  async function updateVls(id, name, coloredPrice) {
    const user = await AsyncStorage.getItem("user");

    fetch(CARPENTRY_API_LINK + "/volle/update", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
      body: JSON.stringify({
        id: id,
        name: name,
        price: coloredPrice,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          getVolles();
          setUpdateVisibe(false);
        }
      });
  }

  async function removeVls(vls) {
    const user = await AsyncStorage.getItem("user");

    fetch(CARPENTRY_API_LINK + "/volle/delete", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
      body: JSON.stringify({
        id: vls,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          getVolles();
        }
      });
  }

  return (
    <View style={styles.container}>
      <ButtonDefault text={"add voli"} onPress={() => setVisibe(true)} />

      <AddVollePopup
        visible={visible}
        setVisible={setVisibe}
        handleAdd={addVolle}
      />

      {vls && (
        <UpdateVollePopup
          visible={updateVisible}
          setVisible={setUpdateVisibe}
          handleUpdate={updateVls}
          vls={vls}
        />
      )}

      {volles.length > 0 &&
        volles.map((ele, index) => (
          <View style={styles.alm} key={index}>
            <View>
              <TextMedium>Name: {ele.name} Da</TextMedium>
              <TextMedium>Price: {ele.price} Da</TextMedium>
            </View>
            <View style={styles.btnGroup}>
              <ButtonDefault
                text="remove"
                onPress={() => removeVls(ele.id)}
                color={DANGER}
                containerStyle={{ flex: 1 }}
              />

              <ButtonDefault
                text="update"
                onPress={() => {
                  setVls(ele);
                  setUpdateVisibe(true);
                }}
                containerStyle={{ flex: 1 }}
              />
            </View>
          </View>
        ))}
    </View>
  );
};

const AddVollePopup = ({ visible, setVisible, handleAdd }) => {
  const [name, setName] = useState("");
  const [coloredPrice, setColoredPrice] = useState("");

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextExtraBold style={styles.modalTitle}>Add Voli</TextExtraBold>

          <View>
            <TextMedium style={styles.modalText}>voli name</TextMedium>
            <DefaultInput
              placeholder="voli name"
              value={name}
              onChangeText={setName}
              style={styles.textInput}
            />
          </View>

          <View>
            <TextMedium style={styles.modalText}>price</TextMedium>
            <DefaultInput
              placeholder="white price"
              value={coloredPrice}
              onChangeText={setColoredPrice}
              style={styles.textInput}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.btnGroup}>
            <ButtonDefault
              text="Cancel"
              color={DANGER}
              onPress={() => setVisible(false)}
              containerStyle={{ flex: 1 }}
            />

            <ButtonDefault
              text="Add"
              onPress={() => {
                handleAdd(name, coloredPrice);
              }}
              containerStyle={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const UpdateVollePopup = ({ visible, setVisible, handleUpdate, vls }) => {
  const [name, setName] = useState(vls.white_price.toString());
  const [coloredPrice, setColoredPrice] = useState(
    vls.colored_price.toString(),
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View>
            <TextMedium style={styles.modalText}>voli name</TextMedium>
            <DefaultInput
              placeholder="voli name"
              value={name}
              onChangeText={setName}
              style={styles.textInput}
            />
          </View>

          <View>
            <TextMedium style={styles.modalText}>price</TextMedium>
            <DefaultInput
              placeholder="price"
              value={coloredPrice}
              onChangeText={setColoredPrice}
              style={styles.textInput}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.btnGroup}>
            <ButtonDefault
              text="Cancel"
              onPress={() => setVisible(false)}
              containerStyle={{ flex: 1 }}
              color={DANGER}
            />

            <ButtonDefault
              text="Update"
              onPress={() => {
                // TODO handleUpdate(vls.id, voliName, whitePrice, coloredPrice)
                handleUpdate(vls.id, name, coloredPrice);
              }}
              containerStyle={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  alm: {
    gap: 25,
    backgroundColor: "white",
    marginTop: 10,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, .5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 15,
    gap: 15,
  },
  modalTitle: {
    fontSize: 25,
  },
  modalText: {
    fontSize: 20,
  },
  textInput: {
    minWidth: Dimensions.get("screen").width - 65,
  },
  btnGroup: {
    flexDirection: "row",
    gap: 15,
  },
  btn: {
    flex: 1,
    padding: 7,
  },
  btnText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
});

export default VolleTab;
