import { StyleSheet } from "react-native";
import { GRAY, WHITE } from "../../../styles/colors";

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  card: {
    backgroundColor: WHITE,
    padding: 20,
    shadowColor: '#171717',
    shadowOffset: {width: -1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: GRAY,
    paddingBottom: 10
  },
  cardBody: {
    paddingVertical: 10,
    borderBottomColor: GRAY,
    borderBottomWidth: 1
  },
  cardBodyText: {
    textAlign: 'left'
  },
  packageNameText: {
    fontSize: 20
  },
  cardFooter: {
    paddingTop: 10
  }
});

export default styles;