import { Dimensions, StyleSheet } from "react-native";
import { GRAY, PRIMARY } from "../../styles/colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GRAY,
        alignItems: "center",
        position: "relative",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        padding: 10,
    },
    headerMenuButton: {
        backgroundColor: PRIMARY,
        padding: 6,
    },
    clientNameText: {
        fontSize: 16,
    },
    footer: {
        backgroundColor: "#fff",
        width: Dimensions.get("screen").width,
    },
    tableHead: {
        height: 28,
        backgroundColor: "#f1f8ff",
    },
    tableText: {
        margin: 6,
        fontSize: 12,
    },
    tableWrapper: {
        flexDirection: "row",
    },
    tableTitle: {
        backgroundColor: "#f6f8fa",
    },
    tableRow: {
        height: 28,
    },
    footerNavigation: {
        backgroundColor: PRIMARY,
        flexDirection: "row",
        alignItems: "center",
    },
    footerNavigationItem: {
        padding: 10,
        height: 50,
        justifyContent: "center",
    },
});

export default styles;
