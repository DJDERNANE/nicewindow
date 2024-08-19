import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";

import { DANGER, PRIMARY } from "../styles/colors";

const InputNumberModal = ({ visible, setVisible, value, setValue, title }) => {
  const [input, setInput] = useState(value || "");

  function handleDone(input) {
    const isNumber = (input) => /^\d+$/.test(input);
    if (isNumber(input)) {
      if (Number(input) > 0) {
        setValue(input);
      }
    }
    setVisible(false);
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setVisible(false)}
    >
      <View
        style={styles.container}
      >
        <View
          style={styles.modalContent}
        >
          <Text style={styles.title}>{title}</Text>
          <TextInput
            value={input.toString()}
            keyboardType="numeric"
            onChangeText={setInput}
            style={styles.input}
          />

          <View
            style={styles.btnContainer}
          >
            <Btn
              style={{ backgroundColor: DANGER }}
              onPress={() => setVisible(false)}
            >
              {"Cancel"}
            </Btn>

            <Btn
              style={{ backgroundColor: PRIMARY }}
              onPress={() => handleDone(input)}
            >
              {"Done"}
            </Btn>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const Btn = ({ children, onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          {
            padding: 7,
            borderRadius: 4,
          },
          { ...style },
        ]}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {children}
        </Text>
      </View>
    </TouchableOpacity>
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
    borderRadius: 5,
  },
  title: {
    textAlign: "center",
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
