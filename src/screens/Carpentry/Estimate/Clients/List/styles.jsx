import { StyleSheet } from "react-native";
import { DARK_GRAY, WHITE } from "../../../../../styles/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  searchView: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    marginBottom: 20,
    borderColor: DARK_GRAY
  },
  clientView: {
    backgroundColor: WHITE,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#171717',
    shadowOffset: {width: -1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  },
  clientNameText: {
    fontSize: 18
  }
});

export default styles;