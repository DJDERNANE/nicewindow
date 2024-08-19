import { StyleSheet } from "react-native";

const Radiostyles = StyleSheet.create({
  option: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    margin: 5,
    borderRadius:5
  },
  color: {
    borderWidth: 1,
    borderColor: '#000',
    width:25,
    marginVertical: 5,
    height: 25,
    margin:5
  },
  colorselected:{
    height: 30,
    width: 30,
    margin:10
  },
  selectedOption: {
    backgroundColor: 'rgba(33, 150, 243, 0.5)', // Reduced opacity for the selected option
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
 
  label: {
    margin: 8,
  },
});

export default Radiostyles;