import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from 'prop-types';
import { TextBold, TextMedium } from "../Text";
import { WHITE } from "../../styles/colors";

export const ButtonSquare = (props) => {
  return(
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.onPress}>
      {props.icon}
      <TextBold style={[styles.text, props.textStyle]}>{props.text}</TextBold>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    width: 180,
    height: 180,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    shadowColor: '#171717',
    shadowOffset: {width: -1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  },
  text: {
    fontSize: 24,
    marginTop: 8,
    textAlign: 'center'
  }
});

ButtonSquare.propTypes = {
  style: PropTypes.any,
  textStyle: PropTypes.any,
  icon: PropTypes.object,
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func
}