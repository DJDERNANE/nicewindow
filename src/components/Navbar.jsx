import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { PRIMARY } from "../styles/colors";

const ListItem = ({ children, onPress }) => {
  const styles = getStyles();
  return (
    <View style={[styles.menuItem]}>
      <TouchableOpacity onPress={onPress}>
        <Text>{children}</Text>
      </TouchableOpacity>
    </View>
  );
};

const Navbar = ({client }) => {
  const [show, setShow] = useState(false);

  const styles = getStyles();

  return (
    <View style={[styles.container]}>
      <Text style={styles.text}>{client}</Text>
      <TouchableOpacity onPress={() => setShow(!show)}>
        <View style={[styles.btn]}>
          <Entypo name="menu" size={28} color="white" />
        </View>
      </TouchableOpacity>
      <View style={[styles.menu, { display: !show ? "none" : null }]}>
        <ListItem>Create PDF</ListItem>
      </View>
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
      right: 0,
      backgroundColor: "white",
    },
    menuItem: {
      padding: 10,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "#eee",
    },
    text: {
      fontSize: 20,
    },
  });
}

export default Navbar;
