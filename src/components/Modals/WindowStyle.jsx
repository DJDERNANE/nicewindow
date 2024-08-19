import React, { useContext, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import WindowExample from "../WindowExample";
import linesStyles from "../../../WindowStyle.json";
import { DANGER, SUCCESS } from "../../styles/colors";
import CONTEXT from "../../context/CONTEXT";

const WindowStyle = ({
  visible,
  setVisible,
  currentIndex,
  stackIndex,
  setModelIndex,
}) => {
  const { color, data } = useContext(CONTEXT);
  const [modalIndex, setModalIndex] = useState(() => {
    if (currentIndex !== undefined) {
      return currentIndex;
    }
    return 0;
  });

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={[styles.container, visible && { ...onActive }]}>
        <View style={[styles.modalContainer]}>
          <ScrollView>
            <View style={styles.modalItemContainer}>
              {linesStyles.map((ele, index) => {
                if (index !== 10)
                  return (
                    <View
                      key={index}
                      style={[
                        styles.modalItem,
                        index === modalIndex && { backgroundColor: "gray" },
                      ]}
                    >
                      <Pressable onPress={() => setModalIndex(index)}>
                        <WindowExample
                          color={color}
                          height={120}
                          width={(Dimensions.get("window").width - 190) / 3}
                          lineStyle={ele}
                        />
                      </Pressable>
                    </View>
                  );
              })}
            </View>
          </ScrollView>
          <View style={[styles.btnsContainer]}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: DANGER }]}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: SUCCESS }]}
              onPress={() => {
                setVisible(false);
                setModelIndex(modalIndex);
              }}
            >
              <Text style={styles.btnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const onActive = {
  backgroundColor: "rgba(0, 0, 0, 0.5)",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    height: Dimensions.get("window").width - 30,
    width: Dimensions.get("window").width - 80,
    backgroundColor: "white",
  },
  modalItemContainer: {
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    rowGap: 10,
  },
  modalItem: {
    padding: 4,
  },
  elementStyle: {
    margin: 1,
    borderWidth: 1,
    borderStyle: "solid",
  },
  btnsContainer: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 15,
  },
  btn: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default WindowStyle;
