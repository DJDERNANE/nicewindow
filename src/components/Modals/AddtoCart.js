
import { Dimensions, StyleSheet, View, TouchableOpacity, Text, FlatList, ScrollView } from "react-native";
import { DANGER, LIGHT, SUCCESS } from "../../styles/colors";
import { ButtonDefault } from "../Buttons/Default";
import { Label } from "../Forms/Label";
import { DefaultInput } from "../Inputs/default";
import PropTypes from "prop-types";
import { BottomModalContainer } from "./BottomContainer";
import Radiostyles from "./style";
import { TextBold } from "../Text";

export const AddtoCart = (props) => {
  console.log(props.proTypes)

  return (
    <BottomModalContainer isVisible={props.isVisible} onBackdropPress={props.onCancel}>
      <ScrollView>
        <View style={styles.body}>
          <TextBold>{props.profile_name} </TextBold>
          <View style={{ flexDirection: 'row' }}>
            {
              Array.isArray(props.Types) && props.Types.length > 0 && props.Types.map((item, key) => (
                <View key={key}>
                  <TouchableOpacity
                    style={[
                      Radiostyles.option,
                      props.selectedOption === props.Types[key] && Radiostyles.selectedOption ]}
                    onPress={() => props.handleTypePress(props.Types[key])}
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
                    Radiostyles.option,
                    props.selectedOption === props.Types[key] && Radiostyles.selectedOption ]}
                  onPress={() => props.handleTypePress(props.Types[key])}
                  >
                    <Text style={styles.optionText}>{props.Types[key]}</Text>
                  </TouchableOpacity>
                </View>
              ))
            }
          </View>
          <View style={{ flexDirection: 'row' , alignItems:'center'}}>
            {Array.isArray(props.colors) && props.colors.length > 0 && props.colors.map((item, key) => (
              <TouchableOpacity
                style={[
                  { backgroundColor: props.colors[key] },
                  Radiostyles.color,
                  props.selectedColor === props.colors[key] && Radiostyles.colorselected ,
                ]}
                onPress={() => props.handleColorPress(props.colors[key])}

                 key={key}
              ></TouchableOpacity>
            ))}

            {!Array.isArray(props.colors) && Object.keys(props.colors).length > 0 && Object.keys(props.colors).map((key) => (
              <TouchableOpacity
                style={[
                  { backgroundColor: props.colors[key] },
                  Radiostyles.color,
                  props.selectedColor === props.colors[key] && Radiostyles.colorselected ,
                ]}
                onPress={() => props.handleColorPress(props.colors[key])}

                key={key}
              ></TouchableOpacity>
            ))}
          </View>

          <View>
            <TextBold>Price : {props.price ? props.price : ''}</TextBold>
          </View>
          <View>
            <TextBold>Max Qty : {props.maxQty ? props.maxQty : ''} </TextBold>
          </View>


          <View style={styles.formGroup}>
            <Label required>Qty: </Label>
            <DefaultInput
              style={styles.input}
              keyboardType={'number-pad'}
              onChangeText={props.onChageQty}
              value={String(props.qty)}
            />
            <TextBold>
            Total:
            {props.totalPrice} DZD
          </TextBold>
          </View>
        </View>
        <View style={styles.footer}>
          <ButtonDefault
            text={'Cancel'}
            color={DANGER}
            containerStyle={styles.footerButton}
            onPress={props.onCancel}
          />

          <ButtonDefault
            text={'Save'}
            color={SUCCESS}
            containerStyle={styles.footerButton}
            onPress={props.onAdd}
          />
        </View>
      </ScrollView>

    </BottomModalContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    marginBottom: 22
  },
  formGroup: {
    marginBottom: 20
  },
  input: {
    backgroundColor: LIGHT
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerButton: {
    width: Dimensions.get('window').width / 2 - 30
  }
});
