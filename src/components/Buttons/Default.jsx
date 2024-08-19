import React, { Fragment } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { TextBold } from "../Text";
import { LIGHT_GRAY, PRIMARY, WHITE } from "../../styles/colors";
import { Badge } from "../Badges/Default";

export const ButtonDefault = (props) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        props.containerStyle,
        {
          backgroundColor: props.disabled
            ? LIGHT_GRAY
            : props.color
              ? props.color
              : PRIMARY,
          paddingHorizontal:
            props.size === "sm" ? 8 : props.size === "md" ? 12 : 18,
          paddingVertical:
            props.size === "sm" ? 6 : props.size === "md" ? 10 : 14,
        },
      ]}
      onPress={!props.disabled ? props.onPress : () => console.log("DISABLED")}
    >
      <TextBold
        style={[
          styles.text,
          props.textStyle,
          {
            fontSize: props.size === "sm" ? 14 : 20,
          },
        ]}
      >
        {props.loading ? (
          <ActivityIndicator color={WHITE} size={"small"} />
        ) : (
          <Fragment>
            {props.icon && props.icon}

            {props.text && props.icon ? " " + props.text : props.text}
            {props.badge && " "}
          </Fragment>
        )}

        {props.badge && <Badge size={"md"}>{props.badge}</Badge>}
      </TextBold>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    shadowColor: "#171717",
    shadowOffset: { width: -1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    justifyContent: "center",
  },
  text: {
    color: WHITE,
  },
});

ButtonDefault.propTypes = {
  color: PropTypes.string,
  containerStyle: PropTypes.object,
  textStyle: PropTypes.object,
  onPress: PropTypes.func,
  text: PropTypes.string,
  badge: PropTypes.any,
  icon: PropTypes.element,
  size: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};
