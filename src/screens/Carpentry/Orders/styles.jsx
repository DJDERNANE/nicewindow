import { StyleSheet } from "react-native";
import { GRAY } from "../../../styles/colors";

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  orderProfileView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  orderItem: {
    paddingVertical: 15,
    borderBottomColor: GRAY,
    borderBottomWidth: 1
  },
  orderItemText: {
    fontSize: 16
  },
  orderProfileViewName: {
    fontSize: 18,
    marginLeft: 12
  },
  orderProfileViewInfos: {
    fontSize: 14,
    marginLeft: 12
  },
  profileIcon: {
    width: 50,
    height: 50
  },
  footer: {
    padding: 20
  },
});

export default styles;