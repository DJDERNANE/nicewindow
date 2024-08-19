import { StyleSheet } from "react-native";
import { WHITE } from "../../../styles/colors";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 20
  },
  langSelectView: {
    backgroundColor: WHITE,
    marginBottom: 10,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#171717',
    shadowOffset: {width: -1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  },
  langSelectText: {
    fontSize: 16
  }
});

export default styles;