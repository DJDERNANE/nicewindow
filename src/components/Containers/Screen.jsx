import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import PropTypes from 'prop-types';

export const Screen = (props) => {
  return(
    <SafeAreaView style={[styles.container, props.style]}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'}  />
      {props.children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

Screen.propTypes = {
  style: PropTypes.object
}