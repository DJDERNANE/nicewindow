import { StyleSheet } from "react-native";
import { DANGER, PRIMARY } from "../../styles/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'red'
  },
  logoView: {
    alignItems: 'center',
    marginBottom: 60
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 6
  },
  title: {
    fontSize: 30,
    marginBottom: 10,
    textAlign: 'left'
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left'
  },
  formGroup: {
    marginBottom: 20
  },
  passwordRecoveryText: {
    color: DANGER,
    textAlign: 'center',
    fontSize: 16
  },
  footer: {
    marginTop: 20
  },
  registerText: {
    textAlign: 'center',
    color: PRIMARY,
    fontSize: 16
  }
});

export default styles;