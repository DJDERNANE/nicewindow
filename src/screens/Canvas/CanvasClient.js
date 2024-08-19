import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
} from "react-native";
import ViewShot from "react-native-view-shot";
import Navbar from "../../components/Navbar";
import { CARPENTRY_API_LINK } from "../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import JsonToJSX from "../../components/JsonToJSX";
import { PRIMARY } from "../../styles/colors";
import { TextBold } from "../../components/Text";

const CanvasScreen = () => {
  const route = useRoute();
  const { client, total, id } = route.params;
  const [clientShapesConfirmed, setClientShapesConfirmed] = useState([]);
  const [jsonString, setJsonString] = useState("");
  const [viewShapeIndex, setViewShapeIndex] = useState(() => {
    if (viewShapeIndex) return viewShapeIndex;
    return 0;
  });
  const [uri, setUri] = useState(null);
  const ref = useRef();

  const getShapesConfirmed = async () => {
    const user = await AsyncStorage.getItem("user");

    fetch(
      CARPENTRY_API_LINK +
      "/shapesConfirmed?id=" +
      client.id +
      "&orderId=" +
      id,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + JSON.parse(user).api_token,
        },
      },
    )
      .then((response) => response.json())
      .then((json) => {
        setClientShapesConfirmed(json.data);
      });
  };
  useEffect(() => {
    getShapesConfirmed();
  }, []);
  const allTheShapes = clientShapesConfirmed.map((ele, index) => {
    return (
      <JsonToJSX
        footer={true}
        jsonString={ele.shape}
        key={index}
        readOnly
        defaultProps={{ frameHeight: 50, frameWidth: 70 }}
      />
    );
  });

  let myshape = clientShapesConfirmed[viewShapeIndex];
  useEffect(() => {
    if (!!clientShapesConfirmed[viewShapeIndex]) {
      setJsonString(clientShapesConfirmed[viewShapeIndex].shape);
    }
  }, [clientShapesConfirmed[viewShapeIndex], clientShapesConfirmed]);
  if (!myshape) return <View style={stylesMain.container} />;
  jsonStr = myshape.shape;
  const almPrice = JSON.parse(jsonStr).params?.aluminum?.price;
  const glssPrice = JSON.parse(jsonStr).params?.glass?.price;
  const alm = JSON.parse(jsonStr).props?.aluminumLength;
  const gls = JSON.parse(jsonStr).props?.glassArea;
  const voli = JSON.parse(jsonStr).props?.voliArea;
  let tableData;
  if (jsonString) {
    tableData = {
      head: ["aluminum length", "glass area", "voli", "total"],
      data: [
        [alm + "m", gls + "m²", voli + "m²", "/"],
        [
          alm ? alm * (almPrice || 0) + "Da" : "/",
          gls ? gls * (glssPrice || 0) + "Da" : "/",
          voli ? voli * 9000 + "Da" : "/",
          gls * (glssPrice || 0) + alm * (almPrice || 0) + "Da" || "/",
        ],
      ],
    };
  }

  return (
    <View style={styles.container}>
      <Navbar client={client.name} />

      <View style={stylesMain.container}>
        <View
          style={{
            paddingHorizontal: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Text>
            Price total: <TextBold>{total}</TextBold> Da
          </Text>
        </View>
        {!!uri ? (
          <View style={{ flex: 1 }}>
            <Image
              source={{ uri }}
              style={[{ height: "100%", width: "100%" }]}
            />
          </View>
        ) : (
          <ViewShot style={{ flex: 1 }} ref={ref}>
            <View style={[stylesMain.canvas]}>
              <JsonToJSX jsonString={jsonString} myIndex={viewShapeIndex} />
            </View>
          </ViewShot>
        )}
      </View>

      <View style={[stylesFooter.container]}>
        <FlatList
          horizontal
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
          data={allTheShapes}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() => setViewShapeIndex(index)}>
                <View
                  key={index}
                  style={[
                    stylesFooter.item,
                    {
                      backgroundColor: index === viewShapeIndex ? "#333" : null,
                    },
                  ]}
                >
                  {item}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};
const stylesFooter = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: PRIMARY,
    height: 50,
  },
  iconBtn: {
    width: 50,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    height: "100%",
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
});

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
const stylesMain = StyleSheet.create({
  container: { flexGrow: 1 },
  canvas: {
    flex: 5 / 5,
    alignItems: "center",
    justifyContent: "center",
  },
  table: { width: "100%" },

  tableHead: {
    backgroundColor: "#f1f8ff",
  },
  tableText: {
    margin: 4,
    fontSize: 10,
  },
  tableWrapper: {
    flexDirection: "row",
  },
  tableTitle: {
    backgroundColor: "#f6f8fa",
  },
  tableRow: {},
});

export default CanvasScreen;
