import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { DANGER } from '../../styles/colors';
import { TextBold, TextMedium } from '../Text';

export const Label = (props) => {
  return(
    <TextBold style={[styles.label, props.style]}>
      {props.children} 
      {props.required && <TextMedium style={styles.requiredCharacter}>*</TextMedium>}
    </TextBold>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    paddingBottom: 10,
    textAlign: 'left'
  },
  requiredCharacter: {
    color: DANGER
  }
});

Label.propTypes = {
  style: PropTypes.object,
  required: PropTypes.bool
}