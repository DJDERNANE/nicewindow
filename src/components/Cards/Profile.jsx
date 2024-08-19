import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { ButtonDefault } from "../Buttons/Default";
import { TextBold } from "../Text";
import { SUCCESS, WHITE } from "../../styles/colors";
import { MAIN_LINK } from "../../utils/constants";

export const ProfileCard = (props) => {
  return(
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Image source={{uri: MAIN_LINK+props.data.icon}} style={styles.icon} />
        </View>
        <View>
          <TextBold>{props.data.name}</TextBold>
        </View>
      </View>
      <View>
        <ButtonDefault 
          text={ 'Add to stock'} 
          size="md" 
          color={SUCCESS} 
          onPress={props.onAddToStock}
          
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: WHITE,
    marginBottom: 20,
    shadowColor: '#171717',
    shadowOffset: {width: -1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderWidth: .3,
  }
});