import { StyleSheet, View } from "react-native";
import { Row, Rows, Table } from "react-native-table-component";

const TableContent = ({ tableData }) => {
  if (!tableData) return null;
  return (
    <View>
      <Table borderStyle={{ borderWidth: 2, borderColor: "#333" }}>
        <Row
          data={tableData.head}
          style={styles.head}
          textStyle={styles.text}
        />
        <Rows
          data={tableData.data}
          style={{ backgroundColor: "white" }}
          textStyle={styles.text}
        />
      </Table>
    </View>
  );
};

const styles = StyleSheet.create({
  head: {
    backgroundColor: "#f1f8ff",
  },
  data: {},
  text: { fontSize: 10, textAlign: "center", paddingVertical: 2 },
});

export default TableContent;
