import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  ScrollView,
} from "react-native";
import { DANGER, LIGHT, SUCCESS } from "../../styles/colors";
import { ButtonDefault } from "../Buttons/Default";
import { Label } from "../Forms/Label";
import { DefaultInput } from "../Inputs/default";
import PropTypes from "prop-types";
import { BottomModalContainer } from "./BottomContainer";
import Radiostyles from "./style";

export const AddToStockModal = (props) => {
  return (
    <BottomModalContainer
      isVisible={props.isVisible}
      onBackdropPress={props.onCancel}
    >
      <ScrollView>
        <View style={styles.body}>
          <View style={styles.formGroup}>
            <Text style={Radiostyles.text}>
              Le Type Selectionner : {props.TheType ? props.TheType : null}
            </Text>
            <FlatList
              data={props.proTypes}
              renderItem={props.ItemRender}
              keyExtractor={(item) => item.id}
              horizontal
            />
          </View>
          <View>
            <Text style={Radiostyles.text}>
              {" "}
              Choisissez un Coleur :{" "}
              <View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: props.TheColor
                    ? props.TheColor
                    : "transparent",
                }}
              ></View>{" "}
            </Text>
            <FlatList
              data={props.colors}
              horizontal
              renderItem={props.ColorsRender}
              keyExtractor={(item) => item.id}
            />
          </View>
          <View style={styles.formGroup}>
            <Label required>Qty: </Label>
            <DefaultInput
              style={styles.input}
              keyboardType={"number-pad"}
              onChangeText={props.onChageQty}
              value={String(props.qty)}
            />
          </View>
          <View style={styles.formGroup}>
            <Label required>Prix d'achat: </Label>
            <DefaultInput
              style={styles.input}
              keyboardType={"number-pad"}
              onChangeText={props.onChagePrixAchat}
              value={String(props.prixAchat)}
            />
          </View>
          <View style={styles.formGroup}>
            <Label required>Price de vente : </Label>
            <DefaultInput
              style={styles.input}
              keyboardType={"number-pad"}
              onChangeText={props.onChagePrice}
              value={String(props.price)}
            />
          </View>
        </View>
        <View style={styles.footer}>
          <ButtonDefault
            text={"Cancel"}
            color={DANGER}
            containerStyle={styles.footerButton}
            onPress={props.onCancel}
          />

          <ButtonDefault
            text={"Save"}
            color={SUCCESS}
            containerStyle={styles.footerButton}
            onPress={props.onAdd}
          />
        </View>
      </ScrollView>
    </BottomModalContainer>
  );
};

const styles = StyleSheet.create({
  body: {
    marginBottom: 22,
  },
  formGroup: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: LIGHT,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerButton: {
    width: Dimensions.get("window").width / 2 - 30,
  },
});

AddToStockModal.propTypes = {
  isVisible: PropTypes.bool,
  onCancel: PropTypes.func,
  onAdd: PropTypes.func,
  onChageQty: PropTypes.func,
  onChagePrice: PropTypes.func,
  qty: PropTypes.number,
  price: PropTypes.number,
};
