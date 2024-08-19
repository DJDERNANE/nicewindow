import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import { FullscreenLoading } from "../../components/Loadings/Fullscreen";

class LogoutScreen extends Component {
  componentDidMount() {
    this.logout();
  }

  async logout() {
    await AsyncStorage.removeItem('user');
    this.props.navigation.navigate('Login');
  }

  render() {
    return(
      <FullscreenLoading />
    );
  }
}

export default LogoutScreen;