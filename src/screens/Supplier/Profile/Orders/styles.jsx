import { Dimensions, StyleSheet } from "react-native";
import { GRAY, WHITE } from "../../../../styles/colors";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: WHITE,
    flex: 1
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
    fontSize: 16,
    
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20
  },
  payment:{
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerButton: {
    width: Dimensions.get('window').width/3+15
  },
  footerButtonCall: {
    width: Dimensions.get('window').width/3-80
  }
});

export default styles;