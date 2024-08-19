import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import { WHITE } from '../../styles/colors';
import { TextBold } from '../Text';

export const DefaultAlert = (props) => {
  return(
    <View style={[styles.container, {backgroundColor: props.type}, props.style, props.top && {paddingTop: 50}]}>
      <TextBold style={styles.text}>{props.children}</TextBold>
      <TouchableOpacity onPress={props.alertClose}>
        <Icon name='close-outline' color={WHITE} size={22} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    position: 'absolute',
    width: '100%',
    top: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10
  },
  text: {
    color: WHITE,
    fontSize: 18
  }
});

DefaultAlert.propTypes = {
  alertClose: PropTypes.func,
  type: PropTypes.string,
  top: PropTypes.bool
}