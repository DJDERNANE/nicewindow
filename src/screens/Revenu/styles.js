import { StyleSheet } from "react-native";
import { WHITE } from "../../styles/colors";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1
  },
  accountingCard: {
    backgroundColor: WHITE,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#171717',
    shadowOffset: {width: -1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sectionTitleText: {
    fontSize: 18
  },
  sectionContentText: {
    fontSize: 16
  }
});

export default styles;