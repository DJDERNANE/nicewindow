import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import { GRAY, LIGHT, WHITE } from '../../styles/colors';
import {
  useFonts,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';

export const PasswordInput = (props) => {
  let [fontsLoaded] = useFonts({
    Montserrat_700Bold
  });

  const [textView, setTextView] = useState(true);

  if(!fontsLoaded)
  {
    return <View />
  }

  return(
    <View style={[styles.container, props.style]}>
      <TextInput 
        returnKeyType={'done'} 
        placeholder='XXXXXXXX' 
        placeholderTextColor={GRAY}
        style={[styles.input, {fontFamily: 'Montserrat_700Bold'}]} 
        onChangeText={props.onChangeText}
        value={props.value}
        maxLength={props.maxLength}
        secureTextEntry={textView}
      />
      <TouchableOpacity style={styles.eyeView} onPress={() => setTextView(!textView)}>
        {textView ? <Octicons name='eye' size={22} /> : <Octicons name='eye-closed' size={20} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: LIGHT,
    shadowColor: '#171717',
    shadowOffset: {width: -1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  },
  eyeView: {
    alignSelf: 'center'
  },
  input: {
    fontSize: 20,
    backgroundColor: WHITE,
    paddingVertical: 14,
    paddingHorizontal: 18,
    width: '88%',
    textAlign: 'left'
  }
});