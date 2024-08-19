import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useCallback, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { PRIMARY } from "../styles/colors";
import { TextLight } from "./Text";

import generateAnInvoice from "../utils/generateAnInvoice";
import { TextMedium } from "./Text";
import database from "../model/db";
import { Q } from "@nozbe/watermelondb";
import * as Print from "expo-print";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CARPENTRY_API_LINK } from "../utils/constants";
import InputNumberModal from "./InputNumberModal";
import { typeOf } from "mathjs";

const ListItem = ({ children, onPress }) => {
  const styles = getStyles();
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.menuItem]}>
        <TextLight>{children}</TextLight>
      </View>
    </TouchableOpacity>
  );
};

const generateSections = async (client, imgs, almGlassData) => {
  const user = JSON.parse(await AsyncStorage.getItem("user"));
  const arr = [];

  for (let i = 0; i < imgs.length; i++) {
    let invoiceHeader = {};
    let invoiceContent = {};
    if (i === 0) {
      invoiceHeader = {
        sender: {
          name: `${user.firstname} ${user.lastname}`,
          email: user.email,
          phone: user.phone_number,
        },
        reciver: {
          name: client.name,
          phone: client.phone,
        },
      };
    }

    invoiceContent = {
      imageUrl: `data:image/png;base64,${imgs[i]}`,
      aluminum: {
        length: Number(almGlassData[i]?.alm?.length),
        price: Number(almGlassData[i]?.alm?.price),
        total: (
          Number(almGlassData[i]?.alm?.length) * almGlassData[i]?.alm?.price
        ).toFixed(3),
      },
      glass: {
        area: Number(almGlassData[i]?.glass?.area),
        price: Number(almGlassData[i]?.glass?.price),
        total: (
          Number(almGlassData[i]?.glass?.area) * almGlassData[i]?.glass?.price
        ).toFixed(3),
      },

      voli: {
        area: Number(almGlassData[i]?.voli?.area),
        price: Number(almGlassData[i]?.voli?.price),
        total: (
          Number(almGlassData[i]?.voli?.area) *
          Number(almGlassData[i]?.voli?.price)
        ).toFixed(3),
      },

      extension: Number(almGlassData[i]?.extension),

      qty: Number(almGlassData[i]?.qty),

      total:
        (Number(almGlassData[i]?.alm?.length) *
          Number(almGlassData[i]?.alm?.price) +
          Number(almGlassData[i]?.glass?.area) *
            Number(almGlassData[i]?.glass?.price) +
          almGlassData[i]?.voli?.area * Number(almGlassData[i]?.voli?.price) +
          Number(almGlassData[i]?.extension)) *
        Number(almGlassData[i]?.qty),
    };

    arr.push({ invoiceHeader, invoiceContent });
  }
  return arr;
};

const Navbar = ({ client }) => {
  const navigation = useNavigation();
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");

  const styles = getStyles();

  const getShapes = useCallback(async (clientId) => {
    const user = await AsyncStorage.getItem("user");
    const res = await fetch(CARPENTRY_API_LINK + "/shapes?id=" + clientId, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
    });
    const data = await res.json();
    return data.data;
  }, []);

  const onInvoicePress = useCallback(async (TVAValue) => {
    const clientInLocaDb = (
      await database.get("clients").query(Q.where("name", client)).fetch()
    )[0];
    const invoiceImgs = (await clientInLocaDb?.getAllInvoices())?.map(
      (ele) => ele?._raw?.img,
    );
    const almGlssVoliData = (await getShapes(clientInLocaDb.dbid))?.map(
      (ele) => {
        const shape = JSON.parse(ele.shape);
        const alm = {
          length: shape?.props?.aluminumLength,
          price: shape?.params?.aluminum?.price,
        };
        const glass = {
          area: shape?.props?.glassArea,
          price: shape?.params?.glass?.price,
        };
        const voli = {
          area: shape?.props?.voliArea,
          price: shape?.params?.volle?.price,
        };
        const qty = shape?.params?.qty?.qty;
        const extension = shape?.params?.extension?.price;
        return { alm, glass, voli, qty, extension };
      },
    );

    const sections = await generateSections(
      clientInLocaDb._raw,
      invoiceImgs,
      almGlssVoliData,
    );
    const htmlContent = generateAnInvoice(sections, TVAValue || null);

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      navigation.navigate("invoice", { uri });
      setShow(false);
    } catch (error) {
      // console.error("this is the error");
      // console.error("Error generating PDF:", error);
    }
  }, []);

  const openModal = () => {
    setVisible(true);
  };

  const onDone = (value) => {
    onInvoicePress(value);
  };

  return (
    <View style={[styles.container]}>
      <TextMedium style={styles.text}>{client}</TextMedium>
      <TouchableOpacity onPress={() => setShow(!show)}>
        <View style={[styles.btn]}>
          <Entypo name="menu" size={28} color="white" />
        </View>
      </TouchableOpacity>
      <View style={[styles.menu, { display: !show ? "none" : null }]}>
        <ListItem onPress={onInvoicePress}>Invoice</ListItem>
        <ListItem onPress={openModal}>Invoice TVA</ListItem>
        <ListItem onPress={() => setShow(false)}>Exit</ListItem>
      </View>
      <InputNumberModal
        visible={visible}
        setVisible={setVisible}
        value={value}
        setValue={setValue}
        title={"TVA %"}
        onDone={onDone}
      />
    </View>
  );
};

function getStyles() {
  return StyleSheet.create({
    container: {
      position: "relative",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
      zIndex: 100,
    },
    btn: {
      width: 30,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: PRIMARY,
    },
    menu: {
      position: "absolute",
      top: "100%",
      right: 10,
      backgroundColor: "white",
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "#ccc",
    },
    menuItem: {
      padding: 10,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "#ccc",
    },
    text: {
      fontSize: 20,
    },
  });
}

export default Navbar;
