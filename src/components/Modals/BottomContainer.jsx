import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";
import { WHITE } from "../../styles/colors";
import PropTypes from "prop-types";

export const BottomModalContainer = (props) => {
  return (
    <View style={[styles.container, props.containerStyle]}>
      <Modal
        isVisible={props.isVisible}
        style={styles.bottomModal}
        onBackdropPress={props.onBackdropPress}
        avoidKeyboard
      >
        <View >
          <ScrollView>
            <View style={styles.modalContent}>
              {props.children}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  bottomModal: {
    justifyContent: "flex-end",
    marginTop: "50%",
    margin: 0,
  },
  modalContent: {
    backgroundColor: WHITE,
    padding: 20,
    paddingBottom: 10,
    borderColor: "rgba(0, 0, 0, 0.1)",
    height:"100%"
  },
});

BottomModalContainer.propTypes = {
  isVisible: PropTypes.bool,
  containerStyle: PropTypes.object,
  onBackdropPress: PropTypes.func,
};