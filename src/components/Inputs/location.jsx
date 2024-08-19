import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BLACK, DARK_GRAY, GRAY, WHITE } from '../../styles/colors';
import {
  useFonts,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';

const LocationInput = (props) => {
  let [fontsLoaded] = useFonts({
    Montserrat_700Bold
  });

  const ref = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      ref?.current?.setAddressText(props.value == null ? '' : props.value);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if(!fontsLoaded)
  {
    return <View />
  }

  return(
    <View style={styles.container}>
      <GooglePlacesAutocomplete 
        placeholder={props.placeholder}
        textInputProps={props.editMode === null ? {
          placeholderTextColor: GRAY,
          value: props.value,
          onChangeText: props.onPress
        } : {
          placeholderTextColor: GRAY
        }}
        ref={ref}
        minLength={2}
        listViewDisplayed={false}
        onPress={props.onPress}
        query={{
          key: 'AIzaSyAsmEvYMC-56OfGlxq8QOsqCnlfSthYAFU',
          language: 'en',
          type: 'establishment',
          components: 'country:dz'
        }}
        GooglePlacesSearchQuery={{
          rankby: 'distance'
        }}
        styles={{
          textInput: {
            backgroundColor: WHITE,
            padding: 18,
            fontSize: 20,
            fontWeight: '600',
            textAlignVertical: 'center',
            fontFamily: 'Montserrat_700Bold'
          },
          row: {
            backgroundColor: WHITE
          },
          poweredContainer: {
            display: 'none'
          },
          listView: {
            width: '105%'
          }
        }}
      />
      
      {props.detectLocationLoading ?
        <ActivityIndicator color={BLACK} />
      :
        <TouchableOpacity onPress={props.detectLocation}>
          <Icon name="my-location" size={24} style={styles.icon} color={DARK_GRAY} />
        </TouchableOpacity>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    paddingTop: 6,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    shadowColor: '#171717',
    shadowOffset: {width: -1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  },
  icon: {
    marginTop: 9
  }
});

export default LocationInput;