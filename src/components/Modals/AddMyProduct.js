
import { Dimensions, StyleSheet, View, TouchableOpacity, Text, FlatList , ScrollView} from "react-native";
import { DANGER, LIGHT, SUCCESS } from "../../styles/colors";
import { ButtonDefault } from "../Buttons/Default";
import { Label } from "../Forms/Label";
import { DefaultInput } from "../Inputs/default";
import PropTypes from "prop-types";
import { BottomModalContainer } from "./BottomContainer";
import Radiostyles from "./style";




export const AddMyProduct = (props) => {
  
  return (
    <BottomModalContainer isVisible={props.isVisible} onBackdropPress={props.onCancel}>
      <ScrollView>
        <View style={styles.body}>
          <View style={styles.formGroup}>
            <Text style={Radiostyles.text}>Category : </Text>
            <FlatList
              data={props.categories}
              renderItem={props.ItemRender}
              keyExtractor={(item) => item.id}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={Radiostyles.text}>Sous Category : </Text>
            <FlatList
              data={props.souscategories}
              renderItem={props.ColorsRender}
              keyExtractor={(item) => item.id}
            />
          </View>
        
          <View style={styles.formGroup}>
            <Label required>Ref: </Label>
            <DefaultInput
              style={styles.input}
             
              onChangeText={props.onChangeRef}
              value={props.Ref}
            />
          </View>
          <View style={styles.formGroup}>
            <Label required>Nom: </Label>
            <DefaultInput
              style={styles.input}
             
              onChangeText={props.onChangeName}
              value={props.Name}
            />
          </View>
          <View style={styles.formGroup}>
            <Label required>Price : </Label>
            <DefaultInput
              style={styles.input}
              keyboardType={'number-pad'}
              onChangeText={props.onChangePrice}
              value={props.price}
            />
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

