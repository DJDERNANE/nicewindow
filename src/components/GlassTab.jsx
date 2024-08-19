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

const GlassTab = () => {
  const [glasss, setGlasss] = useState([]);
  const [visible, setVisibe] = useState(false);
  const [updateVisible, setUpdateVisibe] = useState(false);
  const [gls, setGls] = useState(null);

  async function getGlasss() {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK + '/allglass', {
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
          setGlasss(json.data)
        }
      })
  }

  useEffect(() => {
    getGlasss();
  }, []);

  async function addGlass(name, price) {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK + '/glass/add', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        name: name,
        price: price,
      })
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          getGlasss();
          setVisibe(false)
        }
      })
  }

  async function updateGls(id, name, price) {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK + '/glass/update', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        id:id,
        name: name,
        price: price,
      })
    })
      .then((response) => response.json())
      .then((json) => {
        
        if (json.success) {
          getGlasss();
          setUpdateVisibe(false)
        }
      })
  }

  async function removeGls(gls) {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK + '/glass/delete', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        id: gls,
      })
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          getGlasss();
        }
      })
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
              <Text>name: {ele.name}</Text>
              <Text>price: {ele.price}</Text>
            </View>
            <View style={styles.btnGroup}>
              <View style={[styles.btn, { backgroundColor: DANGER }]}>
                <TouchableOpacity onPress={() => removeGls(ele.id)}>
                  <Text style={[styles.btnText]}>remove</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.btn, { backgroundColor: PRIMARY }]}>
                <TouchableOpacity
                  onPress={() => {
                    setGls(ele);
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
          <Text style={styles.modalTitle}>Add Glass</Text>
          <View>
            <Text style={styles.modalText}>Glass name</Text>
            <TextInput
              value={glassName}
              onChangeText={setGlassName}
              style={styles.textInput}
            />
          </View>

          <View>
            <Text style={styles.modalText}>glass price</Text>
            <TextInput
              value={glassPrice}
              onChangeText={setGlassPrice}
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
                onPress={() => handleAdd(glassName, glassPrice)}
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
            <Text style={styles.modalText}>glass name</Text>
            <TextInput
              value={glassName}
              onChangeText={setGlassName}
              style={styles.textInput}
            />
          </View>

          <View>
            <Text style={styles.modalText}>glass price</Text>
            <TextInput
              value={glassPrice}
              onChangeText={setGlassPrice}
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
                onPress={() => handleUpdate(gls.id, glassName, glassPrice)}
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

export default GlassTab;
