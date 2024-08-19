import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { DANGER, PRIMARY, SUCCESS } from "../../styles/colors";
import { ButtonDefault } from "../Buttons/Default";
import PropTypes from "prop-types";
import { DefaultCanvaWindow } from "../Windows/default";
import { BottomModalContainer } from "./BottomContainer";

export const WindowOptionsModal = (props) => {
    const [verticalSplit, setVerticalSplit] = useState(1);
    const [horizontalSplit, setHorizontalSplit] = useState(1);
    const [openSide, setOpenSide] = useState(null);

    return (
        <BottomModalContainer
            isVisible={props.isVisible}
            onBackdropPress={props.onCancel}
        >
            <View style={styles.body}>
                <View style={styles.bodyTransforms}>
                    <View
                        style={
                            verticalSplit === 1 &&
                            horizontalSplit === 1 &&
                            styles.activeSplit
                        }
                    >
                        <DefaultCanvaWindow
                            verticalSplit={1}
                            horizontalSplit={1}
                            height={60}
                            width={60}
                            style={styles.canvaWindow}
                            onPress={() => [
                                setHorizontalSplit(1),
                                setVerticalSplit(1),
                            ]}
                        />
                    </View>

                    <View
                        style={
                            verticalSplit === 2 &&
                            horizontalSplit === 1 &&
                            styles.activeSplit
                        }
                    >
                        <DefaultCanvaWindow
                            verticalSplit={2}
                            horizontalSplit={1}
                            height={60}
                            width={60}
                            style={styles.canvaWindow}
                            onPress={() => [
                                setVerticalSplit(2),
                                setHorizontalSplit(1),
                            ]}
                        />
                    </View>

                    <View
                        style={
                            verticalSplit === 3 &&
                            horizontalSplit === 1 &&
                            styles.activeSplit
                        }
                    >
                        <DefaultCanvaWindow
                            verticalSplit={3}
                            horizontalSplit={1}
                            height={60}
                            width={60}
                            style={styles.canvaWindow}
                            onPress={() => [
                                setVerticalSplit(3),
                                setHorizontalSplit(1),
                            ]}
                        />
                    </View>

                    <View
                        style={
                            verticalSplit === 1 &&
                            horizontalSplit === 2 &&
                            styles.activeSplit
                        }
                    >
                        <DefaultCanvaWindow
                            verticalSplit={1}
                            horizontalSplit={2}
                            height={60}
                            width={60}
                            style={styles.canvaWindow}
                            onPress={() => [
                                setHorizontalSplit(2),
                                setVerticalSplit(1),
                            ]}
                        />
                    </View>

                    <View
                        style={
                            verticalSplit === 1 &&
                            horizontalSplit === 3 &&
                            styles.activeSplit
                        }
                    >
                        <DefaultCanvaWindow
                            verticalSplit={1}
                            horizontalSplit={3}
                            height={60}
                            width={60}
                            style={styles.canvaWindow}
                            onPress={() => [
                                setHorizontalSplit(3),
                                setVerticalSplit(1),
                            ]}
                        />
                    </View>

                    <View
                        style={
                            verticalSplit === 3 &&
                            horizontalSplit === 3 &&
                            styles.activeSplit
                        }
                    >
                        <DefaultCanvaWindow
                            verticalSplit={3}
                            horizontalSplit={3}
                            height={60}
                            width={60}
                            style={styles.canvaWindow}
                            onPress={() => [
                                setHorizontalSplit(3),
                                setVerticalSplit(3),
                            ]}
                        />
                    </View>
                </View>

                <View style={styles.bodyOpenning}>
                    <View style={openSide === null && styles.activeSplit}>
                        <DefaultCanvaWindow
                            verticalSplit={1}
                            horizontalSplit={1}
                            height={60}
                            width={60}
                            style={styles.canvaWindow}
                            onPress={() => setOpenSide(null)}
                        />
                    </View>

                    <View style={openSide === "right" && styles.activeSplit}>
                        <DefaultCanvaWindow
                            verticalSplit={1}
                            horizontalSplit={1}
                            height={60}
                            width={60}
                            style={styles.canvaWindow}
                            openSide={"right"}
                            onPress={() => setOpenSide("right")}
                        />
                    </View>

                    <View style={openSide === "left" && styles.activeSplit}>
                        <DefaultCanvaWindow
                            verticalSplit={1}
                            horizontalSplit={1}
                            height={60}
                            width={60}
                            style={styles.canvaWindow}
                            openSide={"left"}
                            onPress={() => setOpenSide("left")}
                        />
                    </View>

                    <View style={openSide === "top" && styles.activeSplit}>
                        <DefaultCanvaWindow
                            verticalSplit={1}
                            horizontalSplit={1}
                            height={60}
                            width={60}
                            style={styles.canvaWindow}
                            openSide={"top"}
                            onPress={() => setOpenSide("top")}
                        />
                    </View>

                    <View style={openSide === "bottom" && styles.activeSplit}>
                        <DefaultCanvaWindow
                            verticalSplit={1}
                            horizontalSplit={1}
                            height={60}
                            width={60}
                            style={styles.canvaWindow}
                            openSide={"bottom"}
                            onPress={() => setOpenSide("bottom")}
                        />
                    </View>

                    <View style={openSide === true && styles.activeSplit}>
                        <DefaultCanvaWindow
                            verticalSplit={1}
                            horizontalSplit={1}
                            height={60}
                            width={60}
                            style={styles.canvaWindow}
                            openSide={true}
                            onPress={() => setOpenSide(true)}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.footer}>
                <ButtonDefault
                    text={"Cancel"}
                    color={DANGER}
                    containerStyle={styles.footerButton}
                    onPress={props.onCancel}
                />

                <ButtonDefault
                    text={"Save"}
                    color={SUCCESS}
                    containerStyle={styles.footerButton}
                    onPress={() => [
                        props.changeVerticalSplit(verticalSplit),
                        props.changeHorizontalSplit(horizontalSplit),
                        props.changeOpenSide(openSide),
                        props.onCancel(),
                    ]}
                />
            </View>
        </BottomModalContainer>
    );
};

const styles = StyleSheet.create({
    body: {
        marginBottom: 22,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    bodyTransforms: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "36%",
        padding: 1,
        flexWrap: "wrap",
    },
    bodyOpenning: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "58%",
        padding: 1,
        flexWrap: "wrap",
    },
    canvaWindow: {
        marginBottom: 4,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    footerButton: {
        width: Dimensions.get("window").width / 2 - 30,
    },
    activeSplit: {
        borderWidth: 1,
        borderColor: PRIMARY,
        height: 62,
    },
});

WindowOptionsModal.propTypes = {
    isVisible: PropTypes.bool,
    onCancel: PropTypes.func,
    onAdd: PropTypes.func,
    changeVerticalSplit: PropTypes.func,
    changeHorizontalSplit: PropTypes.func,
    changeOpenSide: PropTypes.func,
};
