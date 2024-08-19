//import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
 import AutoHeightImage from "react-native-auto-height-image";
// import PropTypes from 'prop-types';

// export const ProfilePicturePicker = (props) => {
//   return(
//     <TouchableOpacity style={styles.container}>
//       <AutoHeightImage width={120} source={props.image ? {uri: props.image} : require('../../../assets/default_user.png')} style={styles.image} />
//     </TouchableOpacity>
//   );
// }
import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform } from 'react-native';

export const ProfilePicturePicker = (props) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity style={styles.container} onPress={props.pickImage} >
        <AutoHeightImage width={40} source={props.image ? { uri: props.image } : require('../../../assets/default_user.png')} style={styles.image} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  image: {
    width: 50,
    height: 50
  }
});

// ProfilePicturePicker.propTypes = {
//   image: PropTypes.string
// }