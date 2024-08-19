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

const ExtensionsTab = () => {
  const [extensions, setExtensions] = useState([]);
  const [visible, setVisibe] = useState(false);
  const [updateVisible, setUpdateVisibe] = useState(false);
  const [exts, setExts] = useState(null);


  async function getextensions() {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK + '/extensions', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      }
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        if (json.success) {
          setExtensions(json.data);
        }
      })
  }
  useEffect(() => {
    getextensions();
  }, []);

  async function addExtension(name, price) {
    const user = await AsyncStorage.getItem('user');
    fetch(CARPENTRY_API_LINK + '/extension/add', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        name: name,
        price: price 
      })
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        if (json.success) {
          getextensions();
          setVisibe(false)
        }
      })
  }

  async function updateExts(id, name, price) {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK + '/extension/update', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        id: id,
        name: name,
        price: price 
      })
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          getextensions();
          setUpdateVisibe(false)
        }
      })
  }

  async function removeExts(exts) {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK + '/extension/delete', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        id: exts
      })
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          getextensions();
        }
      })
  }

  return (
    <View style={styles.container}>
      <ButtonDefault
        text={"add Extension"}
        onPress={() => setVisibe(true)}
      />

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
              <Text>Name: {ele.name} </Text>
              <Text>price: {ele.price} Da</Text>
            </View>
            <View style={styles.btnGroup}>
              <View style={[styles.btn, { backgroundColor: DANGER }]}>
                <TouchableOpacity onPress={() => removeExts(ele.id)}>
                  <Text style={[styles.btnText]}>remove</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.btn, { backgroundColor: PRIMARY }]}>
                <TouchableOpacity
                  onPress={() => {
                    setexts(ele);
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
          <Text style={styles.modalTitle}>Add extension</Text>
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
              value={price}
              onChangeText={setprice}
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
                onPress={() => handleAdd(name, price)}
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
              value={price}
              onChangeText={setprice}
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
                onPress={() => handleUpdate(exts.id, name, price)}
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

export default ExtensionsTab;
