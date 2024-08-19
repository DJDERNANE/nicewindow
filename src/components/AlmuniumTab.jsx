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

const AluminiumTab = () => {
  const [aluminiums, setAluminiums] = useState([]);
  const [visible, setVisibe] = useState(false);
  const [updateVisible, setUpdateVisibe] = useState(false);
  const [alm, setAlm] = useState(null);

  async function getAlmuniums() {
    const user = await AsyncStorage.getItem('user');

    const response = await fetch(CARPENTRY_API_LINK + '/alms', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + JSON.parse(user).api_token,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const jsonData = await response.json();
    setAluminiums(jsonData.data)
  }

  useEffect(() => {
    getAlmuniums();
  }, []);

  async function addAlmuniums(name, whitePrice, coloredPrice) {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK + '/alm/add', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        name: name,
        whitePrice: whitePrice,
        coloredPrice: coloredPrice 
      })
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          getAlmuniums();
          setVisibe(false)
        }
      })
  }

  async function updateAlm(id, name, whitePrice, coloredPrice) {
    
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK + '/alm/update', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        id: id,
        name: name,
        whitePrice: whitePrice,
        coloredPrice: coloredPrice 
      })
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        if (json.success) {
          getAlmuniums();
          setUpdateVisibe(false)
        }
      })
  }

  async function removeAlm(alm) {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK + '/alm/delete', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        id: alm,
      })
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          getAlmuniums();
        }
      })
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
              <Text>name: {ele.name}</Text>
              <Text>white color: {ele.white_price}</Text>
              <Text>on color: {ele.colored_price}</Text>
            </View>
            <View style={styles.btnGroup}>
              <View style={[styles.btn, { backgroundColor: DANGER }]}>
                <TouchableOpacity onPress={() => removeAlm(ele.id)}>
                  <Text style={[styles.btnText]}>remove</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.btn, { backgroundColor: PRIMARY }]}>
                <TouchableOpacity
                  onPress={() => {
                    setAlm(ele);
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
          <Text style={styles.modalTitle}>Add Aluminum</Text>
          <View>
            <Text style={styles.modalText}>aluminium name</Text>
            <TextInput
              value={aluminiumName}
              onChangeText={setAluminiumName}
              style={styles.textInput}
            />
          </View>

          <View>
            <Text style={styles.modalText}>aluminium white price</Text>
            <TextInput
              value={aluminiumWhitePrice}
              onChangeText={setAluminiumWhitePrice}
              style={styles.textInput}
              keyboardType="numeric"
            />
          </View>

          <View>
            <Text style={styles.modalText}>aluminium colored price</Text>
            <TextInput
              value={aluminiumColoredPrice}
              onChangeText={setAluminiumColoredPrice}
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
                onPress={() =>
                  handleAdd(
                    aluminiumName,
                    aluminiumWhitePrice,
                    aluminiumColoredPrice,
                  )
                }
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
            <Text style={styles.modalText}>aluminium name</Text>
            <TextInput
              value={aluminiumName}
              onChangeText={setAluminiumName}
              style={styles.textInput}
            />
          </View>

          <View>
            <Text style={styles.modalText}>aluminium white price</Text>
            <TextInput
              value={aluminiumWhitePrice}
              onChangeText={setAluminiumWhitePrice}
              style={styles.textInput}
              keyboardType="numeric"
            />
          </View>

          <View>
            <Text style={styles.modalText}>aluminium colored price</Text>
            <TextInput
              value={aluminiumColoredPrice}
              onChangeText={setAluminiumColoredPrice}
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
                onPress={() =>
                  handleUpdate(
                    alm.id,
                    aluminiumName,
                    aluminiumWhitePrice,
                    aluminiumColoredPrice,
                  )
                }
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

export default AluminiumTab;
