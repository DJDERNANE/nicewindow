import React from "react";
import { Pressable, StyleSheet } from "react-native";
import PropTypes from 'prop-types';
import { DefaultDropdown } from "./default";
import { LIGHT } from "../../styles/colors";
import { TextMedium } from "../Text";
import { useNavigation } from "@react-navigation/native";

export const CanvasDropdown = (props) => {
  const navigation = useNavigation();

  return(
    <DefaultDropdown>
      <Pressable style={styles.item} onPress={props.onCreatePDF}>
        <TextMedium>Create PDF</TextMedium>
      </Pressable>
      <Pressable style={styles.item} onPress={props.onCloseMenu}>
        <TextMedium>Close Menu</TextMedium>
      </Pressable>
      <Pressable style={styles.item} onPress={() => navigation.navigate('Home')}>
        <TextMedium>Exit</TextMedium>
      </Pressable>
    </DefaultDropdown>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT
  }
});

CanvasDropdown.propTypes = {
  onCreatePDF: PropTypes.func,
  onCloseMenu: PropTypes.func
}