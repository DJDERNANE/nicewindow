import React, { useEffect } from "react";
import { StyleSheet, Dimensions, View } from "react-native"; // Import Alert
import Pdf from "react-native-pdf";
import { ButtonDefault } from "./Buttons/Default";
import { SECONDARY } from "../styles/colors";
import { shareAsync } from "expo-sharing";
import * as FileSystem from "expo-file-system";

export default function({ route }) {
  source = {
    uri: route.params.uri,
    cache: true,
  };

  const downloadFile = async () => {
    const cachedFilePath = source.uri;
    const destinationPath = FileSystem.documentDirectory + "invoice.pdf";

    try {
      await FileSystem.copyAsync({
        from: cachedFilePath,
        to: destinationPath,
      });
      console.log("File copied successfully:", destinationPath);
    } catch (error) {
      console.error("Error copying file:", error);
    }
  };

  const shareFile = async () => {
    await shareAsync(source.uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  return (
    <View style={styles.container}>
      {source.uri && <Pdf source={source} style={styles.pdf} />}
      <View style={styles.buttonGroup}>
        <ButtonDefault
          text={"Save"}
          containerStyle={{ width: "50%" }}
          onPress={downloadFile}
        />
        <ButtonDefault
          text={"Share"}
          containerStyle={{ width: "50%" }}
          color={SECONDARY}
          onPress={shareFile}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 5,
  },
});
