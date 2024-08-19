import React from "react";
import { Image, TouchableOpacity, View, Text } from "react-native";
import { ButtonDefault } from "../Buttons/Default";
import { DANGER, SUCCESS } from "../../styles/colors";
import { TextBold } from "../Text";
import { MAIN_LINK } from "../../utils/constants";
import styles from "./styles";

const StockAvailble = (props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={props.handlePress}>
      <View style={styles.header}>
        <View>
          <Image source={{ uri: MAIN_LINK + props.icon }} style={styles.icon} />
        </View>
        <View>
          <TextBold>{props.profile_name} </TextBold>
          <View style={{ flexDirection: "row" }}>
            {Array.isArray(props.colors) &&
              props.colors.length > 0 &&
              props.colors.map((item, key) => (
                <TouchableOpacity
                  style={{
                    backgroundColor: item,
                    width: 20,
                    height: 20,
                    margin: 5,
                  }}
                  key={key}
                ></TouchableOpacity>
              ))}

            {!Array.isArray(props.colors) &&
              Object.keys(props.colors).length > 0 &&
              Object.keys(props.colors).map((key) => (
                <TouchableOpacity
                  style={{
                    backgroundColor: props.colors[key],
                    width: 20,
                    height: 20,
                    margin: 5,
                  }}
                  key={key}
                ></TouchableOpacity>
              ))}
          </View>

          <View style={{ flexDirection: "row" }}>
            {Array.isArray(props.Types) &&
              props.Types.length > 0 &&
              props.Types.map((item, key) => (
                <View key={key}>
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => console.log("Handle onPress")}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
                </View>
              ))}

            {!Array.isArray(props.Types) &&
              typeof props.Types === "object" &&
              Object.keys(props.Types).length > 0 &&
              Object.keys(props.Types).map((key) => (
                <View key={key}>
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => console.log("Handle onPress")}
                  >
                    <Text style={styles.optionText}>{props.Types[key]}</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        </View>
      </View>

      <View style={styles.buttons}>
        <ButtonDefault
          text="Edit"
          size="sm"
          color={SUCCESS}
          containerStyle={styles.button}
          onPress={props.onEdit}
        />

        <ButtonDefault
          text="Delete"
          size="sm"
          color={DANGER}
          containerStyle={styles.button}
          onPress={props.onDestroy}
        />
      </View>
    </TouchableOpacity>
  );
};

export default StockAvailble;
