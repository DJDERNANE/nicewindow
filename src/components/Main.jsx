import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useContext, useEffect, useState, useRef } from "react";
import ViewShot, { captureRef } from "react-native-view-shot";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { unit } from "mathjs";
import { ButtonDefault } from "./Buttons/Default";
import Cntxt from "../context/Cntxt";
import JsonToJSX from "./JsonToJSX";
import TableContent from "./TableContent";
import { isNaN } from "lodash";
import { TextBold } from "./Text";
import { ConfirmOrder } from "./Modals/confirmOrder";
import { CARPENTRY_API_LINK } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Reduction } from "./Modals/reduction";
import database from "../model/db";
import { Q } from "@nozbe/watermelondb";

async function clientInLocalDb(client) {
  try {
    const exist = await database
      .get("clients")
      .query(Q.where("name", client.name))
      .fetch();

    // Check if exist is not null before accessing properties
    if (exist && exist.length > 0) {
      return exist[0];
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error querying the database:", error);
    throw error; // Handle the error or throw it further based on your application logic.
  }
}

async function addClientInLocalDb(client) {
  return await database.write(async () => {
    const newClient = await database.get("clients").create((c) => {
      c.name = client.name;
      c.phone = client.phone_number;
      c.notes = client.notes;
      c.dbid = client.id;
    });

    return newClient;
  });
}

async function addInvoiceImg(client, img, index) {
  let currClient = await clientInLocalDb(client);

  if (!currClient) {
    currClient = await addClientInLocalDb(client);
  }

  const invoices = await currClient?.invoices;
  let invoiceIndex = -1;
  if (invoices?.length > 0) {
    invoiceIndex = invoices.findIndex((i) => i._raw?.index === index);
  }

  if (invoiceIndex > -1) {
    await invoices[invoiceIndex].updateImg(img, index);
  } else {
    if (currClient.addInvoice) await currClient.addInvoice(img, index);
  }
}

const Main = () => {
  const { viewShapeIndex, clientShapes, updateShape, deleteShape, client } =
    useContext(Cntxt);
  const [isPaye, setIsPaye] = useState(false);
  const [jsonString, setJsonString] = useState("");
  const [visible, setVisible] = useState(false);
  const [paye, setPaye] = useState(0);
  const [credit, setCredit] = useState(0);
  const [renderShape, setRenderShape] = useState(false);
  const [shapeUpdated, setShapeUpdated] = useState(false);
  const [promotion, setPromotion] = useState(0);
  const [reductionVisible, setReductionVisible] = useState(false);
  const ref = useRef();

  let myshape = clientShapes[viewShapeIndex];
  let total = 0;

  useEffect(() => {
    if (!!clientShapes[viewShapeIndex]) {
      setJsonString(clientShapes[viewShapeIndex].shape);
    }
  }, [clientShapes[viewShapeIndex], clientShapes]);

  useEffect(() => {
    if (shapeUpdated) {
      if (renderShape) {
        // If the shape has been updated, capture the screenshot
        const captureAndAddInvoice = async () => {
          const sshot = await takeScreenShot();
          // Add invoice image after capturing the screenshot
          await addInvoiceImg(client, sshot, viewShapeIndex);
        };

        captureAndAddInvoice();
        setRenderShape(false);
        setShapeUpdated(false); // Reset the flag
      }
    }
  }, [jsonString, renderShape]);

  useEffect(() => {
    if (!!clientShapes[viewShapeIndex]) {
      setJsonString(clientShapes[viewShapeIndex].shape);
    }
  }, [clientShapes[viewShapeIndex], clientShapes]);

  useEffect(() => {
    setCredit(calcTotalPrice(clientShapes) - paye - promotion);
  }, [clientShapes, paye, promotion]);

  async function updateCurrentShape(newShape) {
    newShape.props.aluminumLength = calcAluminumLength(newShape);
    newShape.props.voliArea = calcVoli(newShape).voliArea;
    newShape.props.glassArea = calcGalssArea(newShape);
    try {
      const newFrame = JSON.stringify({ ...newShape, changed: true });
      await updateShape(newFrame, viewShapeIndex);
      setJsonString(clientShapes[viewShapeIndex].shape);
      setShapeUpdated(true);
      return;
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteMe(clientName, shapeIndex) {
    await deleteShape(myshape.id);
    const clientInLocalDb = (
      await database.get("clients").query(Q.where("name", clientName)).fetch()
    )[0];

    if (clientInLocalDb && clientInLocalDb.deleteInvoiceImg)
      clientInLocalDb
        .deleteInvoiceImg(shapeIndex)
        .catch((err) => console.error(err));
  }

  if (!myshape) return <View style={styles.container} />;

  jsonStr = myshape.shape;
  const almPrice = JSON.parse(jsonStr).params?.aluminum?.price || 0;
  const glssPrice = JSON.parse(jsonStr).params?.glass?.price || 0;
  const vollePrice = JSON.parse(jsonStr).params?.volle?.price || 0;
  const ExtensionPrice = JSON.parse(jsonStr).params?.extension?.price || 0;
  const alm = JSON.parse(jsonStr).props?.aluminumLength || 0;
  const gls = JSON.parse(jsonStr).props?.glassArea || 0;
  const voli = JSON.parse(jsonStr).props?.voliArea || 0;
  const qty = JSON.parse(jsonStr).params?.qty?.qty;
  let tableData;
  if (jsonString) {
    tableData = {
      head: ["aluminum length", "glass area", "voli", "extension", "total"],
      data: [
        [alm + "m", gls + "m²", voli + "m²", "/", qty + " items"],
        [
          alm ? Math.round((alm || 0) * (almPrice || 0)) + "Da" : "/",
          gls ? Math.round((gls || 0) * (glssPrice || 0)) + "Da" : "/",
          voli ? Math.round((voli || 0) * (vollePrice || 0)) + "Da" : "/",
          ExtensionPrice + "Da",
          Math.round(
            (gls || 0) * (glssPrice || 0) +
            (alm || 0) * (almPrice || 0) +
            (voli || 0) * (vollePrice || 0) +
            ExtensionPrice,
          ) *
          qty +
          "Da" || "/",
        ],
      ],
    };

    total = calcTotalPrice(clientShapes);
  }

  async function takeScreenShot() {
    try {
      if (ref.current) {
        const d = await captureRef(ref, {
          format: "jpg",
          quality: 0.9,
          result: "base64",
        });
        return d;
      }
    } catch (error) {
      console.log(error);
    }
  }

  orderPayement = async () => {
    const user = await AsyncStorage.getItem("user");

    fetch(CARPENTRY_API_LINK + "/payement/orderpayement", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(user).api_token,
      },
      body: JSON.stringify({
        client_id: client.id,
        total_price: calcTotalPrice(clientShapes),
        promotion: promotion,
        credit: credit,
        paye: paye,
        shapes: clientShapes,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          setVisible(false);
        }
      });
  };

  changePaye = (value) => {
    setPaye(value);
  };
  updateOrderRemise = () => {
    setReductionVisible(false);
  };
  return (
    <View style={styles.container}>
      <Reduction
        isVisible={reductionVisible}
        onCancel={() => setReductionVisible(false)}
        onChangeRemise={(value) => setPromotion(value)}
        remise={promotion}
        onConfirm={() => updateOrderRemise()}
      />
      <View
        style={{
          paddingHorizontal: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
        }}
      >
        <ButtonDefault
          text="Reduction"
          size={"sm"}
          onPress={() => setReductionVisible(true)}
        />
        <ButtonDefault
          text="Confirm Order"
          size={"sm"}
          onPress={() => setVisible(true)}
        />
      </View>
      <View>
        <Text style={{ fontSize: 18, textAlign: "center" }}>
          Price total: <TextBold>{total}</TextBold> Da (Reduction :{" "}
          <TextBold>{promotion}</TextBold> Da){" "}
        </Text>
      </View>
      <ViewShot style={{ flex: 1, backgroundColor: "white" }} ref={ref}>
        <View style={[styles.canvas]}>
          <JsonToJSX
            jsonString={jsonString}
            updateCurrentShape={updateCurrentShape}
            myIndex={viewShapeIndex}
            setRenderShape={setRenderShape}
          />
        </View>
      </ViewShot>
      <TouchableOpacity
        onPress={() => deleteMe(client?.name, viewShapeIndex)}
        style={{ width: 32 }}
      >
        <MaterialCommunityIcons
          name="archive-remove-outline"
          size={30}
          color="black"
        />
      </TouchableOpacity>
      {jsonString && <TableContent tableData={tableData} />}
      <ConfirmOrder
        isVisible={visible}
        onCancel={() => setVisible(false)}
        payeVisible={isPaye}
        onPaye={() => setIsPaye(true)}
        onCredit={() => setIsPaye(false)}
        paye={paye}
        credit={credit}
        onAdd={() => orderPayement()}
        onChangePaye={(value) => changePaye(value)}
      />
    </View>
  );
};
function calcTotalPrice(clientShapes) {
  const length = clientShapes.length;
  let sum = 0;

  for (let i = 0; i < length; i++) {
    let jsonFRMT;
    if (isJsonString(clientShapes[i].shape)) {
      jsonFRMT = JSON.parse(clientShapes[i].shape);
    } else {
      jsonFRMT = {};
    }

    const { aluminumLength, glassArea, voliArea } = jsonFRMT?.props;

    const aluminumPrice = !isNaN(Number(jsonFRMT?.params?.aluminum?.price))
      ? jsonFRMT?.params?.aluminum?.price
      : 0;

    const glassPrice = !isNaN(Number(jsonFRMT?.params?.glass?.price))
      ? jsonFRMT?.params?.glass?.price
      : 0;

    const vollePrice = !isNaN(jsonFRMT?.params?.volle?.price)
      ? jsonFRMT?.params?.volle?.price
      : 0;

    const extentionPrice = !isNaN(jsonFRMT?.params?.extension?.price)
      ? jsonFRMT?.params?.volle?.price
      : 0;

    const qty = jsonFRMT?.params?.qty?.qty;

    let curr =
      (aluminumLength * aluminumPrice +
        glassArea * glassPrice +
        voliArea * vollePrice +
        extentionPrice) *
      qty;

    if (!isNaN(curr)) {
      sum += curr;
    }
  }
  return sum.toFixed(2);
}

function calcAluminumLength(data) {
  if (!data) return null;
  const {
    props: { frameHeightValue, frameWidthValue, splitDirection },
    children,
  } = data;

  let sum = 0;
  sum += frameWidthValue * 2 + frameHeightValue * 2;

  if (splitDirection === "h") {
    sum += frameWidthValue * (children.length - 1);

    children.forEach((ele) => {
      const { type } = ele;
      if (type === "HWindow") {
        const parentHeight =
          (percentageToNumber(ele.props.height) * frameHeightValue) / 100;

        ele.props.children.forEach((child) => {
          const height =
            (percentageToNumber(child.height) * parentHeight) / 100;

          if (child.modelIndex !== 4) {
            sum += frameWidthValue * 2 + height * 2;
          }
        });

        sum += frameWidthValue * (ele.props.children.length - 1);
      } else {
        const parentHeight =
          (percentageToNumber(ele.props.height) * frameHeightValue) / 100;

        ele.props.children.forEach((child) => {
          const width =
            (percentageToNumber(child.width) * frameWidthValue) / 100;

          if (child.modelIndex !== 4) {
            sum += parentHeight * 2 + width * 2;
          }
        });

        sum += parentHeight * (ele.props.children.length - 1);
      }
    });
  } else {
    sum += frameHeightValue * (children.length - 1);

    children.forEach((ele) => {
      const { type } = ele;
      const parentWidth =
        (percentageToNumber(ele.props.width) * frameWidthValue) / 100;

      if (type === "HWindow") {
        ele.props.children.forEach((child) => {
          const height =
            (percentageToNumber(child.height) * frameHeightValue) / 100;

          if (child.modelIndex !== 4) {
            sum += parentWidth * 2 + height * 2;
          }
        });

        sum += parentWidth * (ele.props.children.length - 1);
      } else {
        ele.props.children.forEach((child) => {
          const width = (percentageToNumber(child.width) * parentWidth) / 100;

          if (child.modelindex !== 4) {
            sum += frameHeightValue * 2 + width * 2;
          }
        });
        sum += frameHeightValue * (ele.props.children.length - 1);
      }
    });
  }

  if (data?.props?.door) {
    sum -= frameWidthValue;
  }

  let voliHeight = 0;

  if (isVoli(data?.children[0])[0]) {
    sum = sum - (frameWidthValue * 3 + voliHeight * 2);

    data?.children[1]?.props?.children?.map((ele) => {
      if (ele?.modelIndex !== 4) {
        sum += voliHeight * 2;
      }
    });

    if (data?.children[1]?.type === "VWindow") {
      let exist = false;
      let height;
      const array = data?.children[1]?.props?.children;
      for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (element.modelIndex === 9 || element.modelIndex === 8) {
          exist = true;
          height =
            (percentageToNumber(data?.children[1]?.props.height) *
              frameHeightValue) /
            100;

          break;
        }
      }
      if (exist) {
        sum -= height;
      } else {
        sum += voliHeight;
      }
    }
  } else {
    const arr = isColisson(data);
    arr.forEach((ele) => (sum -= ele));
  }

  return unit(sum, "mm").toNumber("m").toFixed(3);
}

function calcGalssArea(data) {
  if (!data) return null;

  const {
    props: { frameHeightValue, frameWidthValue },
  } = data;

  return unit(frameHeightValue * frameWidthValue, "mm^2")
    .toNumber("m^2")
    .toFixed(3);
}

function isVoli(hWindow) {
  if (hWindow?.props?.children?.length > 1) return [false, "0%"];

  if (hWindow?.props?.children[0]?.modelIndex === 10) {
    return [true, hWindow?.props?.height];
  }

  return [false, "0%"];
}

function isColisson(data) {
  const { splitDirection, frameHeightValue } = data?.props;
  const array = data?.children;
  const mnsArr = [];

  if (splitDirection === "v") {
    for (let i = 0; i < array.length; i++) {
      const stack = array[i];
      const stackHeight = frameHeightValue;
      const maxNbr = array.length - 1;
      stack?.props?.children?.map((child) => {
        if (child.modelIndex === 8 || child.modelIndex === 9) {
          if (mnsArr.length < maxNbr) {
            const height = Math.round(
              (percentageToNumber(child?.height) * stackHeight) / 100,
            );
            mnsArr.push(height);
          }
        }
      });
    }
  }

  if (splitDirection === "h") {
    array.forEach((stack) => {
      if (stack?.type === "VWindow") {
        const stackHeight = Math.round(
          (percentageToNumber(stack?.props?.height) * frameHeightValue) / 100,
        );

        const length = stack?.props?.children?.length;
        const maxNbr = length - 1;

        for (let i = 0; i < length; i++) {
          const child = stack?.props?.children[i];
          if (child?.modelIndex === 8 || child?.modelIndex === 9) {
            if (mnsArr.length < maxNbr) {
              mnsArr.push(stackHeight);
            }
          }
        }
      }
    });
  }

  return mnsArr;
}

function calcVoli(data) {
  if (!data) return null;

  const { children } = data;

  let exist = false;

  for (let i = 0; i < children.length && !exist; i++) {
    if (children[i].props.children) {
      for (let j = 0; j < children[i].props.children.length && !exist; j++) {
        if (children[i]?.props?.children[j]?.modelIndex === 10) exist = true;
      }
    }
  }

  if (exist) {
    const frameHeightValue = data.props.frameHeightValue;
    const frameWidthValue = data.props.frameWidthValue;
    return {
      isVoli: true,
      voliArea: unit(frameWidthValue * frameHeightValue, "mm^2")
        .toNumber("m^2")
        .toFixed(3),
      voliHeight: data?.children[0]?.props?.height,
    };
  }

  return {
    isVoli: false,
    voliArea: 0,
    voliHeight: "0%",
  };
}

function percentageToNumber(percentageString) {
  if (typeof percentageString !== "string") return null;
  const decimal = parseFloat(percentageString.replace("%", ""));

  if (!isNaN(decimal)) {
    return decimal;
  }
}

function isJsonString(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}

const styles = StyleSheet.create({
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

export default Main;
