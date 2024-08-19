import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 6,
        marginBottom: 20
      },
      header: {
        marginBottom: 20,
        flexDirection: 'row'
      },
      icon: {
        width: 40,
        height: 40,
        marginRight: 10
      },
      buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      button: {
        width: '45%'
      },
      option: {
        borderWidth: 1,
        borderColor: '#000',
        padding: 3,
        margin:4,
        borderRadius: 5
      },
      color: {
        borderWidth: 1,
        borderColor: '#000',
        width:25,
        height: 25,
        margin:5
      },
      colorselected:{
        height: 40,
        width: 40,
        margin:10
      },
      selectedOption: {
        backgroundColor: 'rgba(33, 150, 243, 0.5)', // Reduced opacity for the selected option
      },
      optionText: {
        fontSize: 14,
        color: '#000',
      },
      text: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
      },
     
      label: {
        margin: 8,
      }
});

export default styles;