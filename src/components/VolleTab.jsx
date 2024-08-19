import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { PRIMARY } from "../styles/colors";
import { DANGER } from "../styles/colors";
import { ButtonDefault } from "./Buttons/Default";
import { CARPENTRY_API_LINK } from "../utils/constants";

const VolleTab = () => {
  const [volles, setVolles] = useState([]);
  const [visible, setVisibe] = useState(false);
  const [updateVisible, setUpdateVisibe] = useState(false);
  const [vls, setVls] = useState(null);


  async function getVolles() {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK + '/volles', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      }
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          setVolles(json.data);
        }
      })
  }
  useEffect(() => {
    getVolles();
  }, []);

  async function addVolle(name, coloredPrice) {
    const user = await AsyncStorage.getItem('user');
    fetch(CARPENTRY_API_LINK + '/volle/add', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        name: name,
        price: coloredPrice 
      })
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        if (json.success) {
          getVolles();
          setVisibe(false)
        }
      })
  }

  async function updateVls(id, name, coloredPrice) {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK + '/volle/update', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        id: id,
        name: name,
        price: coloredPrice 
      })
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          getVolles();
          setUpdateVisibe(false)
        }
      })
  }

  async function removeVls(vls) {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK + '/volle/delete', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        id: vls
      })
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          getVolles();
        }
      })
  }

  return (
    <View style={styles.container}>
      <ButtonDefault
        text={"add vollé"}
        onPress={() => setVisibe(true)}
      />

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
              <Text>Name: {ele.name} </Text>
              <Text>price: {ele.price} Da</Text>
            </View>
            <View style={styles.btnGroup}>
              <View style={[styles.btn, { backgroundColor: DANGER }]}>
                <TouchableOpacity onPress={() => removeVls(ele.id)}>
                  <Text style={[styles.btnText]}>remove</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.btn, { backgroundColor: PRIMARY }]}>
                <TouchableOpacity
                  onPress={() => {
                    setVls(ele);
                    setUpdateVisibe(true);
                  }}
                >
                  <Text style={styles.btnText}>update</Text>
                </TouchableOpacity>
              </View>
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
          <Text style={styles.modalTitle}>Add Volle</Text>
          <View>
            <Text style={styles.modalText}>name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.textInput}
              keyboardType="text"
            />
          </View>

          <View>
            <Text style={styles.modalText}>price</Text>
            <TextInput
              value={coloredPrice}
              onChangeText={setColoredPrice}
              style={styles.textInput}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.btnGroup}>
            <View style={[styles.btn, { backgroundColor: DANGER }]}>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={[styles.btnText]}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.btn, { backgroundColor: PRIMARY }]}>
              <TouchableOpacity
                onPress={() => handleAdd(name, coloredPrice)}
              >
                <Text style={styles.btnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const UpdateVollePopup = ({ visible, setVisible, handleUpdate, vls }) => {
  const [name, setName] = useState(vls.white_price.toString());
  const [coloredPrice, setColoredPrice] = useState(vls.colored_price.toString());

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
            <Text style={styles.modalText}>name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.textInput}
              keyboardType="text"
            />
          </View>

          <View>
            <Text style={styles.modalText}>colored price</Text>
            <TextInput
              value={coloredPrice}
              onChangeText={setColoredPrice}
              style={styles.textInput}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.btnGroup}>
            <View style={[styles.btn, { backgroundColor: DANGER }]}>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={[styles.btnText]}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.btn, { backgroundColor: PRIMARY }]}>
              <TouchableOpacity
                onPress={() => handleUpdate(vls.id, name, coloredPrice)}
              >
                <Text style={styles.btnText}>update</Text>
              </TouchableOpacity>
            </View>
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
    borderRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, .5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 6,
    padding: 15,
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  modalText: {
    fontSize: 12,
  },
  textInput: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#333",
    minWidth: 200,
    padding: 4,
    borderRadius: 4,
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

export default VolleTab;
