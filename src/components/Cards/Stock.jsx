import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { ButtonDefault } from "../Buttons/Default";
import { DANGER, SUCCESS, WHITE } from "../../styles/colors";
import { TextBold, TextMedium } from "../Text";
import { MAIN_LINK } from "../../utils/constants";

export const StockCard = (props) => {
  return(
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Image source={{uri: MAIN_LINK+props.data.profile.icon}} style={styles.icon} />
        </View>
        <View>
          <TextBold>{props.data.profile_name} </TextBold>
          <TextBold> La Marque : {props.data.type.name}</TextBold>
          <TextMedium>Qty: {props.data.qty} | Price: {props.data.price} DZD | Coleur :   <View style={{backgroundColor: props.data.color.color_code, width:15, height: 15}}></View></TextMedium>
        </View>
      </View>
      <View style={styles.buttons}>
        <ButtonDefault 
          text="Edit" 
          size="md" 
          color={SUCCESS} 
          containerStyle={styles.button} 
          onPress={props.onEdit}
        />

        <ButtonDefault 
          text="Delete" 
          size="md" 
          color={DANGER} 
          containerStyle={styles.button} 
          onPress={props.onDestroy}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: WHITE,
    borderRadius: 6,
    marginBottom: 20
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row'
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    width: Dimensions.get('screen').width/2-50
  }
});