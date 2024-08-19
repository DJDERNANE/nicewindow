import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Cntxt from "../../context/Cntxt";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Main from "../../components/Main";
import CanvasModels from "../../components/Modals/CanvasModels";
import { CARPENTRY_API_LINK } from "../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { Screen } from "../../components/Containers/Screen";

const CanvasScreen = () => {
  const route = useRoute();
  const { client } = route.params;

  const [showCanvaModels, setShowCanvaModels] = useState(false);

  return (
    <Screen>
      <View style={styles.container}>
        <Navbar client={client.name} />
        <Main />
        <CanvasModels
          isVisible={showCanvaModels}
          onCancel={() => setShowCanvaModels(false)}
        />
        <Footer toggleCanvaModel={() => setShowCanvaModels(true)} />
      </View>
    </Screen>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
});

const DefaultScreen = () => {
  const route = useRoute();
  const [viewShapeIndex, setViewShapeIndex] = useState(() => {
    if (viewShapeIndex) return viewShapeIndex;
    return 0;
  });
  const [clientShapes, setClientShapes] = useState([]);
  const [clientShapesConfirmed, setClientShapesConfirmed] = useState([]);
  const { client } = route.params;

  const getShapes = async () => {
    const user = await AsyncStorage.getItem("user");

    fetch(CARPENTRY_API_LINK + "/shapes?id=" + client.id, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setClientShapes(json.data);
      });
  };

  const getShapesConfirmed = async () => {
    const user = await AsyncStorage.getItem("user");

    fetch(CARPENTRY_API_LINK + "/shapesConfirmed?id=" + client.id, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setClientShapesConfirmed(json.data);
      });
  };

  const addShape = async (shape) => {
    const user = await AsyncStorage.getItem("user");
    fetch(CARPENTRY_API_LINK + "/shape/store", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
      body: JSON.stringify({
        shape: shape,
        id: client.id,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        getShapes();
      });
  };

  useEffect(() => {
    getShapes();
    getShapesConfirmed();
  }, []);

  const updateShape = async (newFrame, index) => {
    if (clientShapes) {
      const user = await AsyncStorage.getItem("user");
      fetch(CARPENTRY_API_LINK + "/shape/update", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + JSON.parse(user).api_token,
        },
        body: JSON.stringify({
          shape: newFrame,
          id: clientShapes[index].id,
        }),
      })
        .then((response) => response.json())
        .then(() => {
          getShapes();
        });
    }
  };

  const deleteShape = async (id) => {
    const user = await AsyncStorage.getItem("user");
    fetch(CARPENTRY_API_LINK + "/shape/delete", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        getShapes();
      });
  };

  return (
    <Cntxt.Provider
      value={{
        addShape,
        updateShape,
        deleteShape,
        viewShapeIndex,
        setViewShapeIndex,
        client,
        clientShapes,
        setClientShapes,
        clientShapesConfirmed,
      }}
    >
      <CanvasScreen />
    </Cntxt.Provider>
  );
};
export default DefaultScreen;
