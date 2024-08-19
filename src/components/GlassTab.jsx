import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PRIMARY } from "../styles/colors";
import { DANGER } from "../styles/colors";
import { ButtonDefault } from "./Buttons/Default";
import { DefaultInput } from "./Inputs/default";
import { CARPENTRY_API_LINK } from "../utils/constants";
import { TextExtraBold, TextMedium } from "./Text";

const GlassTab = () => {
  const [glasss, setGlasss] = useState([]);
  const [visible, setVisibe] = useState(false);
  const [updateVisible, setUpdateVisibe] = useState(false);
  const [gls, setGls] = useState(null);

  async function getGlasss() {
    const user = await AsyncStorage.getItem("user");

    fetch(CARPENTRY_API_LINK + "/allglass", {
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
          setGlasss(json.data);
        }
      });
  }

  useEffect(() => {
    getGlasss();
  }, []);

  async function addGlass(name, price) {
    const user = await AsyncStorage.getItem("user");

    fetch(CARPENTRY_API_LINK + "/glass/add", {
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
          getGlasss();
          setVisibe(false);
        }
      });
  }

  async function updateGls(id, name, price) {
    const user = await AsyncStorage.getItem("user");

    fetch(CARPENTRY_API_LINK + "/glass/update", {
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
          getGlasss();
          setUpdateVisibe(false);
        }
      });
  }

  async function removeGls(gls) {
    const user = await AsyncStorage.getItem("user");

    fetch(CARPENTRY_API_LINK + "/glass/delete", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
      body: JSON.stringify({
        id: gls,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          getGlasss();
        }
      });
  }

  return (
    <View style={styles.container}>
      <ButtonDefault text={"add GLASS"} onPress={() => setVisibe(true)} />

      <AddGlassPopup
        visible={visible}
        setVisible={setVisibe}
        handleAdd={addGlass}
      />

      {gls && (
        <UpdateGlassPopup
          visible={updateVisible}
          setVisible={setUpdateVisibe}
          handleUpdate={updateGls}
          gls={gls}
        />
      )}

      {glasss.length > 0 &&
        glasss.map((ele, index) => (
          <View style={styles.alm} key={index}>
            <View>
              <TextMedium>name: {ele.name}</TextMedium>
              <TextMedium>price: {ele.price}</TextMedium>
            </View>
            <View style={styles.btnGroup}>
              <ButtonDefault
                text="remove"
                color={DANGER}
                onPress={() => removeGls(ele.id)}
                containerStyle={{ flex: 1 }}
              />

              <ButtonDefault
                text="update"
                onPress={() => {
                  setGls(ele);
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

const AddGlassPopup = ({ visible, setVisible, handleAdd }) => {
  const [glassName, setGlassName] = useState("");
  const [glassPrice, setGlassPrice] = useState("");

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextExtraBold style={styles.modalTitle}>Add Glass</TextExtraBold>
          <View>
            <TextMedium style={styles.modalText}>Glass name</TextMedium>
            <DefaultInput
              placeholder="Glass name"
              value={glassName}
              onChangeText={setGlassName}
              style={styles.textInput}
            />
          </View>

          <View>
            <TextMedium style={styles.modalText}>glass price</TextMedium>
            <DefaultInput
              placeholder="glass price"
              value={glassPrice}
              onChangeText={setGlassPrice}
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
              onPress={() => handleAdd(glassName, glassPrice)}
              containerStyle={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const UpdateGlassPopup = ({ visible, setVisible, handleUpdate, gls }) => {
  const [glassName, setGlassName] = useState(gls.name);
  const [glassPrice, setGlassPrice] = useState(gls.price.toString());

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
            <TextMedium style={styles.modalText}>glass name</TextMedium>
            <DefaultInput
              placeholder="glass name"
              value={glassName}
              onChangeText={setGlassName}
              style={styles.textInput}
            />
          </View>

          <View>
            <TextMedium style={styles.modalText}>glass price</TextMedium>
            <DefaultInput
              placeholder="glass price"
              value={glassPrice}
              onChangeText={setGlassPrice}
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
              onPress={() => handleUpdate(gls.id, glassName, glassPrice)}
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
    borderRadius: 4,
  },
  btnText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
});

export default GlassTab;
