import React, { useContext, useMemo } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";

import Cntxt from "../../context/Cntxt";
import JsonToJSX from "../JsonToJSX";
import jsonWindowModal from "../../../WindowModal.json";
import { BottomModalContainer } from "./BottomContainer";

const CanvasModelsModal = ({ isVisible, onCancel }) => {
  const { addShape } = useContext(Cntxt);

  const frameShapeModel = useMemo(
    () =>
      jsonWindowModal.map((w, idx) => {
        return (
          <JsonToJSX
            key={(idx * Date.now()).toString()}
            jsonString={JSON.stringify(w)}
            defaultProps={{
              frameHeight: styles.item.width,
              frameWidth: styles.item.width,
            }}
            readOnly
          />
        );
      }),
    [jsonWindowModal],
  );

  return (
    <BottomModalContainer
      isVisible={isVisible}
      onBackdropPress={() => onCancel(false)}
    >
      <View style={styles.body}>
        {frameShapeModel.map((w, idx) => (
          <TouchableOpacity
            onPress={async () => {
              const newFrame = JSON.stringify(jsonWindowModal[idx]);
             
              await addShape(newFrame);
              onCancel(false);
            }}
          >
            <View key={idx} style={styles.item}>
              {w}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </BottomModalContainer>
  );
};

function calcWidth() {
  return Math.floor((Dimensions.get("screen").width - 60) / 3);
}

const styles = StyleSheet.create({
  body: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  item: {
    width: calcWidth(),
    height: calcWidth(),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
});

export default React.memo(CanvasModelsModal);