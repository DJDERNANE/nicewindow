import React, { useEffect, useState, Fragment } from "react";
import Modal from "react-native-modal";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RadioButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ButtonDefault } from "../Buttons/Default";
import QtyCounter from "../Calc/Qty";
import { TextMedium } from "../Text";
import { SECONDARY, WHITE } from "../../styles/colors";
import { DefaultInput } from "../Inputs/default";
import { CARPENTRY_API_LINK } from "../../utils/constants";
import { Pressable } from "react-native";
import Feather from 'react-native-vector-icons/Feather';

const CanvasRightSlider = ({ isVisible, onClose, oldParams, updateParams }) => {
  const { aluminum, glass, color } = oldParams || {};
  const [checkedAluminum, setCheckedAluminum] = useState(0);
  const [checkedGlass, setCheckedGlass] = useState(0);
  const [checkedVolle, setCheckedVolle] = useState(0);
  const [checkedExt, setCheckedExt] = useState([]);
  const [checkedColor, setCheckedColor] = useState(0);
  const [alms, setAlms] = useState([]);
  const [glss, setGlss] = useState([]);
  const [volle, setVolle] = useState([]);
  const [extensions, setExtensions] = useState([]);
  const [extensionPrice, setExtensionPrice] = useState(0);
  const [qty, setQty] = useState(1);

  const [colors, setColors] = useState([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (aluminum?.index) {
      setCheckedAluminum(aluminum.index);
    }
    if (glass?.index) {
      setCheckedGlass(glass.index);
    }
    if (volle?.index) {
      setCheckedVolle(volle.index);
    }
    if (color?.index) {
      setCheckedColor(color.index);
    }
  }, [oldParams]);

  useEffect(() => {
    setExtensionPrice(0);
    checkedExt.forEach((elt) => {
      setExtensionPrice((prevExtensionPrice) => prevExtensionPrice + elt.price);
    });
  }, [checkedExt]);

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
    setAlms(jsonData.data)
  }
  useEffect(() => {
    getAlmuniums();
  }, []);

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
          setGlss(json.data)
        }
      })
  }
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
          setVolle(json.data)
        }
      })
  }

  async function getExtensions() {
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
        if (json.success) {
          setExtensions(json.data)
        }
      })
  }


  useEffect(() => {
    async function getColors() {
      const user = await AsyncStorage.getItem('user');

      fetch(CARPENTRY_API_LINK + '/shape/colors', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + JSON.parse(user).api_token
        }
      })
        .then((response) => response.json())
        .then((json) => {
          setColors(json.data)
        })
    }
    getColors();
  }, []);

  useEffect(() => {
    getGlasss();
  }, []);
  useEffect(() => {
    getVolles();
  }, []);
  useEffect(() => {
    getExtensions();
  }, []);

  const handleOnClose = () =>
    updateParams({
      aluminum: {
        index: checkedAluminum,
        price:
          checkedColor > 0
            ? alms[checkedAluminum].colored_price
            : alms[checkedAluminum].white_price,
      },
      glass: {
        index: checkedGlass,
        price: glss[checkedGlass].price,
      },
      volle: {
        index: checkedVolle,
        price: volle[checkedVolle].price,
      },
      extension: {
        price: extensionPrice
      },
      color: {
        color: colors[checkedColor].color_code,
      },
      qty: {
        qty: qty
      }

    });

  const onChangeQty = (operator) => {
    if (operator === "-") {
      if (qty > 1) {
        setQty(qty - 1);
      }
    } else {
      if (qty < 10) {
        setQty(qty + 1);
      }
    }
  };

  if (!isVisible) {
    return null;
  }
  const isExtensionSelected = (extensionId) => {
    return checkedExt.some((ext) => ext.extensionId === extensionId);
  };

  const toggleCategorySelection = (extensionId, price) => {
    const existingExtensionIndex = checkedExt.findIndex((ext) => ext.extensionId === extensionId);

    if (existingExtensionIndex !== -1) {
      // Extension already exists, remove it
      const updatedCheckedExt = [...checkedExt];
      updatedCheckedExt.splice(existingExtensionIndex, 1);
      setCheckedExt(updatedCheckedExt);
    } else {
      // Extension doesn't exist, add it with price
      setCheckedExt((prevCheckedExt) => [
        ...prevCheckedExt,
        { extensionId, price },
      ]);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      backdropOpacity={0.5}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={[styles.menuContainer, { paddingTop: insets.top }]}>
        <ScrollView>
          <View>
            <TextMedium style={styles.sectionTitle}>الكمية</TextMedium>
            <QtyCounter
              value={qty}
              onChange={(operator) => onChangeQty(operator)}
            />
          </View>

          <View>
            <TextMedium style={styles.sectionTitle}>نوع الألمنيوم</TextMedium>
            {alms.length > 0 &&
              alms.map((ele, index) => (
                <View style={styles.row} key={index}>
                  <RadioButton
                    value={null}
                    status={checkedAluminum === index ? "checked" : "unchecked"}
                    onPress={() => setCheckedAluminum(index)}
                  />
                  <TextMedium>
                    {ele.name} -{" "}
                    {checkedColor > 0 ? ele.colored_price : ele.white_price} Da
                  </TextMedium>
                </View>
              ))}
          </View>

          <View>
            <TextMedium style={styles.sectionTitle}>نوع الزجاج</TextMedium>
            {glss.map((ele, index) => (
              <View style={styles.row} key={index}>
                <RadioButton
                  value={null}
                  status={checkedGlass === index ? "checked" : "unchecked"}
                  onPress={() => setCheckedGlass(index)}
                />
                <TextMedium>
                  {ele.name} - {ele.price} Da
                </TextMedium>
              </View>
            ))}
          </View>

          <View>
            <TextMedium style={styles.sectionTitle}>volle </TextMedium>
            {volle.map((ele, index) => (
              <View style={styles.row} key={index}>
                <RadioButton
                  value={null}
                  status={checkedVolle === index ? "checked" : "unchecked"}
                  onPress={() => setCheckedVolle(index)}
                />
                <TextMedium>
                  {ele.name} - {ele.price} Da
                </TextMedium>
              </View>
            ))}
          </View>

          <View>
            <TextMedium style={styles.sectionTitle}>Extensions</TextMedium>
            {extensions && extensions.length > 0 && (
              <Fragment>
                {extensions.map((data, key) => (
                  <Pressable
                    style={styles.checkbox}
                    key={key}
                    onPress={() => toggleCategorySelection(data.id, data.price)}
                  >
                    {isExtensionSelected(data.id) && <Feather name="check" size={18} />}
                    <TextMedium style={{marginLeft: 10}}>
                      {data.name} - {data.price} Da
                    </TextMedium>
                  </Pressable>
                ))}
              </Fragment>
            )}
          </View>

          <View>
            <TextMedium style={styles.sectionTitle}>اللون</TextMedium>
            {colors.map((ele, index) => (
              <View style={styles.row} key={index}>
                <View
                  style={{
                    marginLeft: 5,
                    height: 30,
                    width: 30,
                    backgroundColor: ele.color_code,
                    borderWidth: 1,
                    borderStyle: "solid",
                  }}
                />
                <RadioButton
                  value={null}
                  status={checkedColor === index ? "checked" : "unchecked"}
                  onPress={() => setCheckedColor(index)}
                />
                <TextMedium>{ele.name_ar}</TextMedium>
              </View>
            ))}
          </View>
        </ScrollView>
        <ButtonDefault text={"تحديد"} onPress={handleOnClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  checkbox:{
    flexDirection: 'row',
    padding:10
  },
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  menuContainer: {
    backgroundColor: "white",
    flex: 1,
    width: "70%",
  },
  sectionTitle: {
    backgroundColor: SECONDARY,
    color: WHITE,
    textAlign: "center",
    fontSize: 16,
    padding: 4,
  },
  input: {
    borderWidth: 1,
    margin: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default CanvasRightSlider;
