import React, { useEffect, useState } from "react";
import { View, Text, Modal, StyleSheet, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DANGER } from "../styles/colors";
import { ButtonDefault } from "./Buttons/Default";
import { DefaultInput } from "./Inputs/default";
import { CARPENTRY_API_LINK } from "../utils/constants";
import { TextExtraBold, TextMedium } from "./Text";

const AluminiumTab = () => {
  const [aluminiums, setAluminiums] = useState([]);
  const [visible, setVisibe] = useState(false);
  const [updateVisible, setUpdateVisibe] = useState(false);
  const [alm, setAlm] = useState(null);

  async function getAlmuniums() {
    const user = await AsyncStorage.getItem("user");

    const response = await fetch(CARPENTRY_API_LINK + "/alms", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const jsonData = await response.json();
    setAluminiums(jsonData.data);
  }

  useEffect(() => {
    getAlmuniums();
  }, []);

  async function addAlmuniums(name, whitePrice, coloredPrice) {
    const user = await AsyncStorage.getItem("user");

    fetch(CARPENTRY_API_LINK + "/alm/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
      body: JSON.stringify({
        name: name,
        whitePrice: whitePrice,
        coloredPrice: coloredPrice,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          getAlmuniums();
          setVisibe(false);
        }
      });
  }

  async function updateAlm(id, name, whitePrice, coloredPrice) {
    const user = await AsyncStorage.getItem("user");

    fetch(CARPENTRY_API_LINK + "/alm/update", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
      body: JSON.stringify({
        id: id,
        name: name,
        whitePrice: whitePrice,
        coloredPrice: coloredPrice,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (json.success) {
          getAlmuniums();
          setUpdateVisibe(false);
        }
      });
  }

  async function removeAlm(alm) {
    const user = await AsyncStorage.getItem("user");

    fetch(CARPENTRY_API_LINK + "/alm/delete", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
      body: JSON.stringify({
        id: alm,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          getAlmuniums();
        }
      });
  }
  return (
    <View style={styles.container}>
      <ButtonDefault text={"add aluminium"} onPress={() => setVisibe(true)} />

      <AddAluminiumPopup
        visible={visible}
        setVisible={setVisibe}
        handleAdd={addAlmuniums}
      />

      {alm && (
        <UpdateAluminiumPopup
          visible={updateVisible}
          setVisible={setUpdateVisibe}
          handleUpdate={updateAlm}
          alm={alm}
        />
      )}

      {aluminiums.length > 0 &&
        aluminiums.map((ele, index) => (
          <View style={styles.alm} key={index}>
            <View>
              <TextMedium>name: {ele.name}</TextMedium>
              <TextMedium>white color: {ele.white_price}</TextMedium>
              <TextMedium>on color: {ele.colored_price}</TextMedium>
            </View>
            <View style={styles.btnGroup}>
              <ButtonDefault
                text="remove"
                onPress={() => removeAlm(ele.id)}
                color={DANGER}
                containerStyle={{ flex: 1 }}
              />

              <ButtonDefault
                text="update"
                onPress={() => {
                  setAlm(ele);
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

const AddAluminiumPopup = ({ visible, setVisible, handleAdd }) => {
  const [aluminiumName, setAluminiumName] = useState("");
  const [aluminiumWhitePrice, setAluminiumWhitePrice] = useState("");
  const [aluminiumColoredPrice, setAluminiumColoredPrice] = useState("");

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextExtraBold style={styles.modalTitle}>Add Aluminum</TextExtraBold>
          <View>
            <TextMedium style={styles.modalText}>aluminium name</TextMedium>
            <DefaultInput
              value={aluminiumName}
              placeholder="aluminium name"
              onChangeText={setAluminiumName}
              style={styles.textInput}
            />
          </View>

          <View>
            <Text style={styles.modalText}>aluminium white price</Text>
            <DefaultInput
              value={aluminiumWhitePrice}
              placeholder="aluminium white price"
              onChangeText={setAluminiumWhitePrice}
              style={styles.textInput}
              keyboardType="numeric"
            />
          </View>

          <View>
            <Text style={styles.modalText}>aluminium colored price</Text>
            <DefaultInput
              placeholder="aluminium colored price"
              value={aluminiumColoredPrice}
              onChangeText={setAluminiumColoredPrice}
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
              onPress={() =>
                handleAdd(
                  aluminiumName,
                  aluminiumWhitePrice,
                  aluminiumColoredPrice,
                )
              }
              containerStyle={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const UpdateAluminiumPopup = ({ visible, setVisible, handleUpdate, alm }) => {
  const [aluminiumName, setAluminiumName] = useState(alm.name);
  const [aluminiumWhitePrice, setAluminiumWhitePrice] = useState(
    alm.white_price.toString(),
  );
  const [aluminiumColoredPrice, setAluminiumColoredPrice] = useState(
    alm.colored_price.toString(),
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
            <TextMedium style={styles.modalText}>aluminium name</TextMedium>
            <DefaultInput
              placeholder="aluminium name"
              value={aluminiumName}
              onChangeText={setAluminiumName}
              style={styles.textInput}
            />
          </View>

          <View>
            <TextMedium style={styles.modalText}>
              aluminium white price
            </TextMedium>
            <DefaultInput
              placeholder="aluminium white price"
              value={aluminiumWhitePrice}
              onChangeText={setAluminiumWhitePrice}
              style={styles.textInput}
              keyboardType="numeric"
            />
          </View>

          <View>
            <TextMedium style={styles.modalText}>
              aluminium colored price
            </TextMedium>
            <DefaultInput
              placeholder="aluminium colored price"
              value={aluminiumColoredPrice}
              onChangeText={setAluminiumColoredPrice}
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
              text="Update"
              onPress={() =>
                handleUpdate(
                  alm.id,
                  aluminiumName,
                  aluminiumWhitePrice,
                  aluminiumColoredPrice,
                )
              }
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
    padding: 15,
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
    borderRadius: 4,
  },
  btnText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
});

export default AluminiumTab;
