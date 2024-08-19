import { StyleSheet } from "react-native";
import { LIGHT, WHITE } from "../../styles/colors";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: LIGHT
  },
  button: {
    backgroundColor: WHITE,
    marginVertical: 10,
    padding: 20,
    shadowColor: '#171717',
    shadowOffset: {width: -1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'left',
    marginLeft: 8
  }
});

export default styles;