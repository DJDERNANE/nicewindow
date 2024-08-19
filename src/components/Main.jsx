import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useContext, useEffect, useState, useRef } from "react";
import ViewShot from "react-native-view-shot";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { unit } from "mathjs";
import { ButtonDefault } from "./Buttons/Default";
import { WARNING, SUCCESS } from "../styles/colors";
import Cntxt from "../context/Cntxt";
import JsonToJSX from "./JsonToJSX";
import TableContent from "./TableContent";
import { isNaN } from "lodash";
import { TextBold } from "./Text";
import { ConfirmOrder } from "./Modals/confirmOrder";
import { CARPENTRY_API_LINK } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Reduction } from "./Modals/reduction";

const Main = () => {
  const { viewShapeIndex, clientShapes, updateShape, deleteShape, client } = useContext(Cntxt);
  const [isPaye, setIsPaye] = useState(false)
  const [jsonString, setJsonString] = useState("");
  const [uri, setUri] = useState(null);
  const [visible, setVisible] = useState(false);
  const [paye, setPaye] = useState(0);
  const [credit, setCredit] = useState(0);
  const [total, setTotal] = useState(0);
  const [promotion, setPromotion] = useState(0);
  const [reductionVisible, setReductionVisible]= useState(false)
  const ref = useRef();

  let myshape = clientShapes[viewShapeIndex];

  useEffect(() => {
    if (!!clientShapes[viewShapeIndex]) {
      setJsonString(clientShapes[viewShapeIndex].shape);
    }
  }, [clientShapes[viewShapeIndex], clientShapes]);
  useEffect(()=>{setTotal(calcTotalPrice(clientShapes)-promotion)},[calcTotalPrice(clientShapes), promotion])
  useEffect(() => {
    setCredit(calcTotalPrice(clientShapes) - paye - promotion)
  }, [clientShapes, paye,promotion]);
  useEffect(() => {
    calcTotalPrice(clientShapes)
  }, []);


  async function updateCurrentShape(newShape) {
    newShape.props.aluminumLength = calcAluminumLength(newShape);
    newShape.props.voliArea = calcVoli(newShape).voliArea;
    newShape.props.glassArea = calcGalssArea(newShape);
    try {
      const newFrame = JSON.stringify({ ...newShape, changed: true });
      await updateShape(newFrame, viewShapeIndex);
      setJsonString(clientShapes[viewShapeIndex].shape);
      return;
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteMe() {
    await deleteShape(myshape.id);
  }

  if (!myshape) return <View style={styles.container} />;

  jsonStr = myshape.shape;
  const almPrice = JSON.parse(jsonStr).params?.aluminum?.price;
  const glssPrice = JSON.parse(jsonStr).params?.glass?.price;
  const vollePrice = JSON.parse(jsonStr).params?.volle?.price;
  const ExtensionPrice = JSON.parse(jsonStr).params?.extension?.price;
  const alm = JSON.parse(jsonStr).props?.aluminumLength;
  const gls = JSON.parse(jsonStr).props?.glassArea;
  const voli = JSON.parse(jsonStr).props?.voliArea;
  const qty = JSON.parse(jsonStr).params?.qty?.qty;
  let tableData;
  if (jsonString) {
    tableData = {
      head: ["aluminum length", "glass area", "voli", "extension", "total"],
      data: [
        [alm + "m", gls + "m²", voli + "m²", "/", qty+ ' items'],
        [
          alm ? alm * (almPrice || 0) + "Da" : "/",
          gls ? gls * (glssPrice || 0) + "Da" : "/",
          voli ? voli * vollePrice + "Da" : "/",
          ExtensionPrice + "Da",
          (gls * (glssPrice || 0) + alm * (almPrice || 0) + voli * vollePrice + ExtensionPrice)*qty + "Da" || "/",
        ],
      ],
    };
  }

  async function takeScreenShot() {
    try {
      if (ref.current) {
        const d = await ref.current.capture();
        setUri(d);
      }
    } catch (error) {
      console.log(error);
    }
  }


  orderPayement = async () => {
    const user = await AsyncStorage.getItem('user');

    fetch(CARPENTRY_API_LINK + '/payement/orderpayement', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(user).api_token
      },
      body: JSON.stringify({
        client_id: client.id,
        total_price: calcTotalPrice(clientShapes),
        promotion: promotion,
        credit: credit,
        paye: paye,
        shapes: clientShapes
      })
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          setVisible(false)
        }
      })
  }


  // payment = (item) => {
  //   //console.log(item)
  //   this.setState(prevState => ({
  //     isvisible: true,
  //     paye: item.total_price - item.paye,
  //     credit: 0,
  //     total_price: item.total_price,
  //     orderId: item.id
  //   }));
  // }
  changePaye = (value) => {
    setPaye(value);
  }
  updateOrderRemise = () =>{
    setReductionVisible(false)
  }
  return (
    <View style={styles.container}>
      <Reduction
        isVisible={reductionVisible}
        onCancel={() => setReductionVisible(false)}
        onChangeRemise={(value) => setPromotion(value)}
        remise={promotion}
        onConfirm={() => updateOrderRemise()}
      />
      <View style={{ paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>

        <ButtonDefault
          text="Reduction"
          size={'sm'}
          onPress={() => setReductionVisible(true)}
        />
        <ButtonDefault
          text="Confirm Order"
          size={'sm'}
          onPress={() => setVisible(true)}
        />



      </View>
      <View>
        <Text style={{ fontSize: 18, textAlign: 'center' }}>Price total: <TextBold >{total}</TextBold>  Da  (Reduction : <TextBold>{promotion}</TextBold> Da) </Text>
      </View>

      {!!uri ? (
        <View style={{ flex: 1 }}>
          <Image source={{ uri }} style={[{ height: "100%", width: "100%" }]} />
        </View>
      ) : (
        <ViewShot style={{ flex: 1 }} ref={ref}>
          <View style={[styles.canvas]}>
            <JsonToJSX
              jsonString={jsonString}
              updateCurrentShape={updateCurrentShape}
              myIndex={viewShapeIndex}
            />
          </View>
        </ViewShot>
      )}
      <TouchableOpacity onPress={() => deleteMe()}>
        <MaterialCommunityIcons
          name="archive-remove-outline"
          size={30}
          color="black"
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          takeScreenShot();
        }}
      >
        <Text>click me</Text>
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
    const jsonFRMT = JSON.parse(clientShapes[i].shape);
    const { aluminumLength, glassArea, voliArea } = jsonFRMT?.props;

    const ExtensionPrice = jsonFRMT?.params?.extension?.price;
    const qty = jsonFRMT?.params?.qty?.qty;

    const aluminumPrice = !isNaN(jsonFRMT?.params?.aluminum?.price)
      ? jsonFRMT?.params?.aluminum?.price
      : 0;

    const glassPrice = !isNaN(jsonFRMT?.params?.glass?.price)
      ? jsonFRMT?.params?.glass?.price
      : 0;

    const vollePrice = !isNaN(jsonFRMT?.params?.volle?.price)
      ? jsonFRMT?.params?.volle?.price
      : 0;
    let curr =
      (aluminumLength * aluminumPrice + glassArea * glassPrice + voliArea * vollePrice + ExtensionPrice) * qty;


    if (!isNaN(curr)) {
      sum += curr;
    }
  }
  return Math.round(sum);
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
        const parentHeight = Math.round(
          (percentageToNumber(ele.props.height) * frameHeightValue) / 100,
        );
        ele.props.children.forEach((child) => {
          const height = Math.round(
            (percentageToNumber(child.height) * parentHeight) / 100,
          );
          if (child.modelIndex !== 4 && child.modelIndex !== 10) {
            sum += frameWidthValue * 2 + height * 2;
          }
        });

        sum += frameWidthValue * (ele.props.children.length - 1);
      } else {
        const parentHeight = Math.round(
          (percentageToNumber(ele.props.height) * frameHeightValue) / 100,
        );
        ele.props.children.forEach((child) => {
          const width = Math.round(
            (percentageToNumber(child.width) * frameWidthValue) / 100,
          );
          if (child.modelIndex !== 4 && child.modelIndex !== 10) {
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
      const parentWidth = Math.round(
        (percentageToNumber(ele.props.width) * frameWidthValue) / 100,
      );
      if (type === "HWindow") {
        ele.props.children.forEach((child) => {
          const height = Math.round(
            (percentageToNumber(child.height) * frameHeightValue) / 100,
          );

          if (child.modelIndex !== 4 && child.modelIndex !== 10) {
            sum += parentWidth * 2 + height * 2;
          }
        });

        sum += parentWidth * (ele.props.children.length - 1);
      } else {
        ele.props.children.forEach((child) => {
          const width = Math.round(
            (percentageToNumber(child.width) * parentWidth) / 100,
          );
          if (child.modelindex !== 4 && child.modelindex !== 10) {
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

  return unit(sum, "mm").toNumber("m");
}

function calcGalssArea(data) {
  if (!data) return null;

  let voli = null;

  // const { voliHeight } = calcVoli(data);

  const {
    props: { frameHeightValue, frameWidthValue, splitDirection },
    children,
  } = data;

  let area = 0;

  if (splitDirection === "h") {
    children.forEach((ele) => {
      const { type } = ele;

      if (type === "HWindow") {
        if (isVoli(ele)[0] === true) {
          voli = isVoli(ele);
        } else {
          let parentHeight;

          if (voli) {
            parentHeight = Math.round(
              ((percentageToNumber(ele.props.height) +
                percentageToNumber(voli[1])) *
                frameHeightValue) /
              100,
            );
          } else {
            parentHeight = Math.round(
              (percentageToNumber(ele.props.height) * frameHeightValue) / 100,
            );
          }

          ele.props.children.forEach((child) => {
            const height = Math.round(
              (percentageToNumber(child.height) * parentHeight) / 100,
            );
            if (child.modelIndex !== 4 && child.modelIndex !== 10) {
              area += frameWidthValue * height;
            }
          });

          voli = [false, "0%"];
        }
      } else {
        let parentHeight;
        if (voli[0] === true) {
          parentHeight = Math.round(
            ((percentageToNumber(ele.props.height) +
              percentageToNumber(voli[1])) *
              frameHeightValue) /
            100,
          );
        } else {
          parentHeight = Math.round(
            (percentageToNumber(ele.props.height) * frameHeightValue) / 100,
          );
        }

        ele.props.children.forEach((child) => {
          const width = Math.round(
            (percentageToNumber(child.width) * frameWidthValue) / 100,
          );
          if (child.modelIndex !== 4 && child.modelIndex !== 10) {
            area += parentHeight * width;
          }
        });
        voli = [false, "0%"];
      }
    });
  } else {
    children.forEach((ele) => {
      const { type } = ele;
      const parentWidth = Math.round(
        (percentageToNumber(ele.props.width) * frameWidthValue) / 100,
      );
      if (type === "HWindow") {
        ele.props.children.forEach((child) => {
          const height = Math.round(
            (percentageToNumber(child.height) * frameHeightValue) / 100,
          );

          if (child.modelIndex !== 4 && child.modelIndex !== 10) {
            area += parentWidth * height;
          }
        });
      } else {
        ele.props.children.forEach((child) => {
          const width = Math.round(
            (percentageToNumber(child.width) * parentWidth) / 100,
          );
          if (child.modelIndex !== 4 && child.modelIndex !== 10) {
            area += frameHeightValue * width;
          }
        });
      }
    });
  }
  return unit(area, "mm^2").toNumber("m^2").toFixed(3);
}

function isVoli(hWindow) {
  if (hWindow?.props?.children?.length > 1) return [false, "0%"];

  if (hWindow?.props?.children[0]?.modelIndex === 10) {
    return [true, hWindow?.props?.height];
  }

  return [false, "0%"];
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
