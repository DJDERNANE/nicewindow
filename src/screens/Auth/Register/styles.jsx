import { StyleSheet } from "react-native";
import { BLACK, INFO } from "../../../styles/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  formGroup: {
    marginBottom: 20
  },
  label: {
    color: BLACK
  },
  footer: {
    marginTop: 10
  },
  footerText: {
    fontSize: 16,
    textAlign: 'center',
    color: INFO
  }
});

export default styles;