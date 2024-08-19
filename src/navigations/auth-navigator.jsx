import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/Auth/Login";
import AccountTypeSelectScreen from "../screens/Auth/AccountType/Main";
import SupplierAccountTypeSelectScreen from "../screens/Auth/AccountType/Supplier";
import PasswordRecoveryScreen from "../screens/Auth/Password/Recovery";
import RegisterScreen from "../screens/Auth/Register";

const Stack = createNativeStackNavigator();

function AuthNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    headerTitleAlign: "center",
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen
                    name="RegisterAccountType"
                    component={AccountTypeSelectScreen}
                />
                <Stack.Screen
                    name="RegisterAccountTypeSupplier"
                    component={SupplierAccountTypeSelectScreen}
                />
                <Stack.Screen
                    name="PasswordRecovery"
                    component={PasswordRecoveryScreen}
                />
                <Stack.Screen name="Register" component={RegisterScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AuthNavigator;
