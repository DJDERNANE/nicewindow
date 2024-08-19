import { StyleSheet } from "react-native";
import { LIGHT_GRAY, WHITE } from "../../../styles/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  formGroup: {
    marginBottom: 16
  },
  addressView: {
    borderColor: LIGHT_GRAY,
    borderWidth: 2,
    padding: 10
  },
  footer: {
    padding: 20,
    backgroundColor: WHITE
  }
});

export default styles;