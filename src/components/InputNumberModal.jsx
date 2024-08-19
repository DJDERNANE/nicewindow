import { Dimensions, Modal, StyleSheet, View } from "react-native";
import { useState } from "react";

import { DefaultInput } from "./Inputs/default";
import { DANGER } from "../styles/colors";
import { TextExtraBold } from "./Text";
import { ButtonDefault } from "./Buttons/Default";

const InputNumberModal = ({
  visible,
  setVisible,
  value,
  setValue,
  title,
  onDone,
}) => {
  const [input, setInput] = useState(value || "");

  function handleDone(input) {
    const isNumber = (input) => /^\d+$/.test(input);
    if (isNumber(input)) {
      if (Number(input) > 0) {
        setValue(input);
      }
    }
    setVisible(false);
    if (onDone) onDone(Number(input));
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <TextExtraBold style={styles.title}>{title}</TextExtraBold>
          <DefaultInput
            value={input.toString()}
            onChangeText={setInput}
            keyboardType="numeric"
            style={{
              minWidth: Dimensions.get("screen").width - 65,
            }}
          />

          <View style={styles.btnContainer}>
            <ButtonDefault
              text={"Cancel"}
              onPress={() => setVisible(false)}
              color={DANGER}
              containerStyle={{ flex: 1 }}
            />
            <ButtonDefault
              text={"Done"}
              onPress={() => handleDone(input)}
              containerStyle={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    gap: 20,
    padding: 20,
  },
  title: {
    fontSize: 16,
    marginBottom: -5,
  },
  input: {
    width: 150,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 4,
    paddingLeft: 2,
    marginBottom: -5,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});

export default InputNumberModal;
