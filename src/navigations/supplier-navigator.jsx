import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import StockScreen from "../screens/Supplier/Profile/Stock";
import AddStockCategoriesScreen from "../screens/Supplier/Profile/Stock/Add/categories";
import { TextBold } from "../components/Text";

const Stack = createNativeStackNavigator();

function SupplierNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Stock"
                    component={StockScreen}
                    options={{
                        headerShown: true,
                        headerBackTitleVisible: false,
                        headerTitle: () => (
                            <TextBold style={{ fontSize: 18 }}>Stock</TextBold>
                        ),
                    }}
                />

                <Stack.Screen
                    name="AddStock"
                    component={AddStockCategoriesScreen}
                    options={{
                        headerShown: true,
                        headerBackTitleVisible: false,
                        headerTitle: () => (
                            <TextBold style={{ fontSize: 18 }}>Stock</TextBold>
                        ),
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default SupplierNavigator;
