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
import { CARPENTRY_API_LINK } from "../utils/constants";
import { TextExtraBold, TextMedium } from "./Text";
import { DefaultInput } from "./Inputs/default";

const ExtensionsTab = () => {
  const [extensions, setExtensions] = useState([]);
  const [visible, setVisibe] = useState(false);
  const [updateVisible, setUpdateVisibe] = useState(false);
  const [exts, setExts] = useState(null);

  async function getextensions() {
    const user = await AsyncStorage.getItem("user");

    fetch(CARPENTRY_API_LINK + "/extensions", {
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
          setExtensions(json.data);
        }
      });
  }
  useEffect(() => {
    getextensions();
  }, []);

  async function addExtension(name, price) {
    const user = await AsyncStorage.getItem("user");
    fetch(CARPENTRY_API_LINK + "/extension/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
      body: JSON.stringify({
        name: name,
        price: price,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          getextensions();
          setVisibe(false);
        }
      });
  }

  async function updateExts(id, name, price) {
    const user = await AsyncStorage.getItem("user");

    fetch(CARPENTRY_API_LINK + "/extension/update", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
      body: JSON.stringify({
        id: id,
        name: name,
        price: price,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          getextensions();
          setUpdateVisibe(false);
        }
      });
  }

  async function removeExts(exts) {
    const user = await AsyncStorage.getItem("user");

    fetch(CARPENTRY_API_LINK + "/extension/delete", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
      body: JSON.stringify({
        id: exts,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          getextensions();
        }
      });
  }

  return (
    <View style={styles.container}>
      <ButtonDefault text={"add Extension"} onPress={() => setVisibe(true)} />

      <AddExtensionPopup
        visible={visible}
        setVisible={setVisibe}
        handleAdd={addExtension}
      />

      {exts && (
        <UpdateextensionPopup
          visible={updateVisible}
          setVisible={setUpdateVisibe}
          handleUpdate={updateExts}
          exts={exts}
        />
      )}

      {extensions.length > 0 &&
        extensions.map((ele, index) => (
          <View style={styles.alm} key={index}>
            <View>
              <TextMedium>Name: {ele.name} </TextMedium>
              <TextMedium>price: {ele.price} Da</TextMedium>
            </View>
            <View style={styles.btnGroup}>
              <ButtonDefault
                text="remove"
                onPress={() => removeExts(ele.id)}
                color={DANGER}
                containerStyle={{ flex: 1 }}
              />

              <ButtonDefault
                text="update"
                onPress={() => {
                  setExts(ele);
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

const AddExtensionPopup = ({ visible, setVisible, handleAdd }) => {
  const [name, setName] = useState("");
  const [price, setprice] = useState("");

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextExtraBold style={styles.modalTitle}>Add extension</TextExtraBold>

          <View>
            <TextMedium style={styles.modalText}>Name</TextMedium>
            <DefaultInput
              placeholder={"Extention Name"}
              onChangeText={setName}
              value={name}
              style={styles.textInput}
            />
          </View>

          <View>
            <TextMedium style={styles.modalText}>Extention Price</TextMedium>
            <DefaultInput
              placeholder={"Extention Price"}
              onChangeText={setprice}
              value={price}
              keyboardType="numeric"
              style={styles.textInput}
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
                handleAdd(name, price);
                // TODO handleAdd(voliName, whitePrice, coloredPrice);
              }}
              containerStyle={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const UpdateextensionPopup = ({ visible, setVisible, handleUpdate, exts }) => {
  const [name, setName] = useState(exts.name);
  const [price, setprice] = useState(exts.price.toString());

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
            <TextMedium style={styles.modalText}>name</TextMedium>
            <DefaultInput
              placeholder={"Extention Name"}
              onChangeText={setName}
              value={name}
              style={styles.textInput}
            />
          </View>

          <View>
            <TextMedium style={styles.modalText}>Extention Price</TextMedium>
            <DefaultInput
              placeholder={"Extention Price"}
              onChangeText={setprice}
              value={price}
              keyboardType="numeric"
              style={styles.textInput}
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
              text="update"
              onPress={() => handleUpdate(exts.id, name, price)}
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
    gap: 10,
    backgroundColor: "white",
    margin: 10,
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
    padding: 20,
    gap: 20,
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
    borderRadius: 4,
  },
  btnText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
});

export default ExtensionsTab;
