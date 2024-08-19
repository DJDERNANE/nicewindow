import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import PropTypes from 'prop-types';
import { TextBold } from "../Text";
import { ButtonDefault } from "../Buttons/Default";
import { DANGER, WHITE } from "../../styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_LINK } from "../../utils/constants";

export const LocationCard = (props) => {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const destroy = async () => {
    setDeleteLoading(true);
    const user = await AsyncStorage.getItem('user');

    fetch(API_LINK+'/location/destroy', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ JSON.parse(user).api_token
      },
      body: JSON.stringify({
        id: props.data.id
      })
    })
    .then((response) => response.json())
    .then((json) => {
      if(json.success)
      {
        setDeleteLoading(false);
        props.refresh()
      }
    })
  }

  return(
    <View style={styles.container}>
      <TextBold style={styles.text}>{props.data.address}</TextBold>
      <View style={styles.buttons}>
        <ButtonDefault 
          text={'Delete'} 
          color={DANGER} 
          icon={<SimpleLineIcons name="trash" size={16} />}
          onPress={() => destroy()}
          loading={deleteLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#171717',
    shadowOffset: {width: -1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  },
  text: {
    fontSize: 16
  },
  buttons: {
    marginTop: 20
  }
})

LocationCard.propTypes = {
  data: PropTypes.object,
  refresh: PropTypes.func
}