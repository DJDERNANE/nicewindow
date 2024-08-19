import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Dialog from "react-native-dialog";
import PropTypes from 'prop-types';

export const DialogPrompt = (props) => {
  const [ inputValue, setInputValue ] = useState(props.value);

  return(
    <View style={styles.container}>
      <Dialog.Container visible={props.visible}>
        <Dialog.Title>{props.title}</Dialog.Title>
        <Dialog.Input 
          style={styles.input} 
          value={String(inputValue)} 
          keyboardType="number-pad" 
          onChangeText={(value) => setInputValue(value)}
          autoFocus
          showSoftInputOnFocus
        />
        <Dialog.Button label="Cancel" onPress={props.onCancel} />
        <Dialog.Button label="Save" onPress={() => props.onDone(inputValue)} />
      </Dialog.Container>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent:'center', 
    alignItems:'center'
  },
  input: {
    paddingHorizontal:10,
    borderRadius:10
  }
});

DialogPrompt.propTypes = {
  visible: PropTypes.bool,
  value: PropTypes.any,
  onCancel: PropTypes.func,
  onDone: PropTypes.func,
  title: PropTypes.string
}