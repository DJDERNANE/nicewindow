import React from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from 'prop-types';
import { TextMedium } from "../Text";
import { DANGER, WHITE } from "../../styles/colors";

export const Badge = (props) => {
  return(
    <View style={
      [
        styles.container, 
        {
          backgroundColor: props.color ? props.color : DANGER
        }
      ]
    }>
      <TextMedium style={
        [
          styles.text,
          {
            fontSize: props.size === 'md' ? 14 : props.size === 'lg' ? 16 : 10
          }
        ]
      }>
        {props.children}
      </TextMedium>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    borderRadius: 100,
    justifyContent: 'center'
  },
  text: {
    color: WHITE,
    fontSize: 10,
    textAlign: 'center'
  }
});

Badge.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string
}