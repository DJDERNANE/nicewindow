import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around'
  },
  button: {
    height: Dimensions.get('screen').height/4,
    width: '100%'
  }
});

export default styles;