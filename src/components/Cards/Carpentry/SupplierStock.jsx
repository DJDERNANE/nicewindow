import React from "react";
import { Dimensions, Image, StyleSheet, View, FlatList, TouchableOpacity, Text } from "react-native";
import { ButtonDefault } from "../../Buttons/Default";
//import { DANGER, SUCCESS } from "../../../styles/colors";
import { DANGER,SUCCESS } from "../../../styles/colors";
import { TextBold, TextMedium } from "../../Text";
import { MAIN_LINK } from "../../../utils/constants";
import styles from "../styles";

export default  SupplierStock = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Image source={{ uri: MAIN_LINK + props.icon }} style={styles.icon} />
        </View>
        <View>
          <TextBold>{props.profile_name} </TextBold>
          <View style={{ flexDirection: 'row' }}>
            {
              Array.isArray(props.colors) && props.colors.length > 0 && props.colors.map((item, key) => (
                <TouchableOpacity style={{ backgroundColor: item, width: 20, height: 20, margin: 5 }} key={key}></TouchableOpacity>
              ))
            }

            {
              !Array.isArray(props.colors) && Object.keys(props.colors).length > 0 && Object.keys(props.colors).map((key) => (
                <TouchableOpacity style={{ backgroundColor: props.colors[key], width: 20, height: 20, margin: 5 }} key={key}></TouchableOpacity>
              ))
            }

          </View>

          <View style={{ flexDirection: 'row' }}>
            {
              Array.isArray(props.Types) && props.Types.length > 0 && props.Types.map((item, key) => (
                <View key={key}>
                  <TouchableOpacity
                    style={[
                      styles.option,
                    ]}
                  // onPress={() => this.handleCategorySelect(item.id)}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
                </View>
              ))
            }

            {
              !Array.isArray(props.Types) && typeof props.Types === 'object' && Object.keys(props.Types).length > 0 && Object.keys(props.Types).map((key) => (
                <View key={key}>
                  <TouchableOpacity
                    style={[
                      styles.option,
                    ]}
                  // onPress={() => this.handleCategorySelect(props.Types[key].id)}
                  >
                    <Text style={styles.optionText}>{props.Types[key]}</Text>
                  </TouchableOpacity>
                </View>
              ))
            }
          </View>
        </View>
      </View>



      <View style={styles.buttons}>
        <ButtonDefault
          text="Add to Cart"
          size="sm"
          color={SUCCESS}
          containerStyle={styles.button}
          onPress={props.onAddtocart}
          
        />
      </View>
    </View>
  );
}
