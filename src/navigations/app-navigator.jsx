import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/Auth/Login";
import PasswordRecoveryScreen from "../screens/Auth/Password/Recovery";
import RegisterScreen from "../screens/Auth/Register";
import HomeScreen from "../screens/Home";
import AccountTypeSelectScreen from "../screens/Auth/AccountType/Main";
import SettingsScreen from "../screens/Settings";
import { PRIMARY } from "../styles/colors";
import LogoutScreen from "../screens/Logout";
import GeneralSettingsScreen from "../screens/Settings/General";
import SecuritySettingsScreen from "../screens/Settings/Security";
import AppointmentsScreen from "../screens/Carpentry/Appointments";
import RepairScreen from "../screens/Client/Repair";
import { TextBold } from "../components/Text";
import LanguagesSettingsScreen from "../screens/Settings/Lanaguages";
import ClientOrdersScreen from "../screens/Client/Orders/styles";
import SubscribtionsSettingsScreen from "../screens/Settings/Subscribtions";
import CanvasScreen from "../screens/Canvas";
import MyCanvasScreen from "../screens/MyCanvas";
import AddAppointmentScreen from "../screens/Carpentry/Appointments/Add";
import LocationsSettingsScreen from "../screens/Settings/Locations";
import AddLocationScreen from "../screens/Settings/Locations/Add";
import CarpentryOrdersScreen from "../screens/Carpentry/Orders";
import StockScreen from "../screens/Supplier/Profile/Stock";
import ClientsScreen from "../screens/Supplier/Profile/Clients";
import AddStockCategoriesScreen from "../screens/Supplier/Profile/Stock/Add/categories";
import WhereScreen from "../screens/Supplier/Profile/Stock/Add/where";
import AddStockProfilesScreen from "../screens/Supplier/Profile/Stock/Add/profiles";
import ProfileSupplierOrdersScreen from "../screens/Supplier/Profile/Orders";
import ProfileSupplierOrderScreen from "../screens/Supplier/Profile/Orders/single";
import SuppliersScreen from "../screens/Carpentry/Suppliers";
import SupplierProfileScreen from "../screens/Carpentry/Suppliers/Profiles";
import CarpentryProfileOrderScreen from "../screens/Carpentry/Orders/single";
import EstimateScreen from "../screens/Carpentry/Estimate";
import AddClientScreen from "../screens/Carpentry/Estimate/Clients/Add";
import EstimateClientsListScreen from "../screens/Carpentry/Estimate/Clients/List";
import CartScreen from "../screens/Carpentry/Cart";
import SupplierCartScreen from "../screens/Supplier/Profile/Cart";
import SupplierAccountingScreen from "../screens/Supplier/Profile/Accounting";
import CarpentryAccountingScreen from "../screens/Carpentry/Accounting";
import CarpentrySuppliersCategoriesScreen from "../screens/Carpentry/Suppliers/categories";
import CarpentrySuppliersSearchScreen from "../screens/Carpentry/Suppliers/search";
import i18n from "../../i18n";
import UsersSettingsScreen from "../screens/Settings/Users";
import AddUserScreen from "../screens/Settings/Users/Add";
import EditUserScreen from "../screens/Settings/Users/Edit";
import PricesSettingsScreen from "../screens/Settings/Prices";
import DeleteAccountScreen from "../screens/Settings/General/delete";
import AddStockSubcategoriesScreen from "../screens/Supplier/Profile/Stock/Add/subcategories";
import SupplierProductsScreen from "../screens/Supplier/Profile/Orders/Add";
import MyProductsScreen from "../screens/Supplier/Profile/Stock/Add/myproducts";
import RevenuScreen from "../screens/Revenu";
import CarpentryRevenuScreen from "../screens/Revenu/carpentryRevenu";
import ClientHistoryScreen from "../screens/Supplier/Profile/Clients/History";
import ClientOrder from "../screens/Carpentry/Estimate/Clients";
import ClientOrdersList from "../screens/Carpentry/Estimate/Clients/ClientOrdersList";
import CanvasClient from "../screens/Canvas/CanvasClient";
import ConfirmEmail from "../screens/ConfimEmail";
import StockArticleScreen from "../screens/Supplier/Profile/Stock/article";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return(
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerShown: false,
          headerTitleAlign: 'center'
        }}
        >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RegisterAccountType" component={AccountTypeSelectScreen} />
        <Stack.Screen name="PasswordRecovery" component={PasswordRecoveryScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            headerShown: true,
            headerBackVisible: false,
            headerTitle: 'NICE WINDOW',
            headerTintColor: PRIMARY
          }} 
        />
        <Stack.Screen 
        name="ConfirmEmail" 
        component={ConfirmEmail} 
        options={{
          headerShown: true,
          headerBackVisible: false,
          headerTitle: 'NICE WINDOW',
          headerTintColor: PRIMARY
        }} 
      />
        <Stack.Screen 
          name="Revenu" 
          component={RevenuScreen} 
          options={{
            headerShown: true,
            headerBackVisible: false,
            headerTitle: 'NICE WINDOW',
            headerTintColor: PRIMARY
          }} 
        />
        <Stack.Screen 
          name="CarpentryRevenu" 
          component={CarpentryRevenuScreen} 
          options={{
            headerShown: true,
            headerBackVisible: false,
            headerTitle: 'NICE WINDOW',
            headerTintColor: PRIMARY
          }} 
        />
        <Stack.Screen 
          name="clienthistory" 
          component={ClientHistoryScreen} 
          options={{
            headerShown: true,
            headerBackVisible: false,
            headerTitle: 'NICE WINDOW',
            headerTintColor: PRIMARY
          }} 
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>{ i18n.t('home.settings') }</TextBold>
            )
          }} 
        />
        <Stack.Screen 
          name="LocationsSettings" 
          component={LocationsSettingsScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>{ i18n.t('settings.locations.title') }</TextBold>
            )
          }} 
        />
        <Stack.Screen 
          name="AddLocation" 
          component={AddLocationScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>{ i18n.t('settings.locations.title') }</TextBold>
            )
          }} 
        />
        <Stack.Screen 
          name="GeneralSettings" 
          component={GeneralSettingsScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>{ i18n.t('settings.general.title') }</TextBold>
            )
          }} 
        />
        <Stack.Screen 
          name="DeleteSettings" 
          component={DeleteAccountScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>{ i18n.t('settings.general.title') }</TextBold>
            )
          }} 
        />
        <Stack.Screen 
          name="SecuritySettings" 
          component={SecuritySettingsScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>{ i18n.t('settings.security.title') }</TextBold>
            )
          }} 
        />
        <Stack.Screen 
          name="UsersSettings" 
          component={UsersSettingsScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}> { i18n.t('settings.users.title') } </TextBold>
            )
          }} 
        />
        <Stack.Screen 
          name="AddUserSettings" 
          component={AddUserScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>{ i18n.t('settings.users.title') }</TextBold>
            )
          }} 
        />
        <Stack.Screen 
          name="EditUserSettings" 
          component={EditUserScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>Edit User</TextBold>
            )
          }} 
        />
        <Stack.Screen 
          name="PricesSettings" 
          component={PricesSettingsScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>Prices</TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="Suppliers" 
          component={SuppliersScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>{ i18n.t('suppliers.title') }</TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="CarpentrySuppliersCategories" 
          component={CarpentrySuppliersCategoriesScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>{ i18n.t('suppliers.categories.title') }</TextBold>
            )
          }} 
        />
        <Stack.Screen 
          name="SupplierProducts" 
          component={SupplierProductsScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>My Products </TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="CarpentrySuppliersSearch" 
          component={CarpentrySuppliersSearchScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>Choose Supplier</TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="Cart" 
          component={CartScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>Cart</TextBold>
            )
          }} 
        />
        <Stack.Screen 
          name="SupplierCart" 
          component={SupplierCartScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>Cart</TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="SupplierProfile" 
          component={SupplierProfileScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>Supplier Profile</TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="Appointments" 
          component={AppointmentsScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>{ i18n.t('appointments.title') }</TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="AddAppointment" 
          component={AddAppointmentScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>{ i18n.t('appointments.buttons.add_appointment') }</TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="Repair" 
          component={RepairScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false
          }} 
        />

        <Stack.Screen 
          name="LanguagesSettings" 
          component={LanguagesSettingsScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>{ i18n.t('settings.languages.title') }</TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="ClientOrders" 
          component={ClientOrdersScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>Orders</TextBold>
            )
          }} 
        />
        <Stack.Screen 
        name="ClientOrder" 
        component={ClientOrder} 
        options={{
          headerShown: true, 
          headerBackTitleVisible: false,
          headerTitle: () => (
            <TextBold style={{fontSize: 18}}>Orders</TextBold>
          )
        }} 
      />
        <Stack.Screen 
          name="CarpentryOrders" 
          component={CarpentryOrdersScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>{ i18n.t('orders.title') }</TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="SubscribtionsSettings" 
          component={SubscribtionsSettingsScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>{ i18n.t('settings.subscribtions.title') }</TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="Estimate" 
          component={EstimateScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>{ i18n.t('new_order.title') }</TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="AddClient" 
          component={AddClientScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>Add Client</TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="EstimateClients" 
          component={EstimateClientsListScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>{ i18n.t('new_order.all_clients.title') }</TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="Canvas" 
          component={CanvasScreen} 
          options={{
            headerShown: false, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>Canvas</TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="CanvasClient" 
          component={CanvasClient} 
          options={{
            headerShown: false, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>Canvas</TextBold>
            )
          }} 
        />
        <Stack.Screen 
        name="myCanvas" 
        component={MyCanvasScreen} 
        options={{
          headerShown: false, 
          headerBackTitleVisible: false,
          headerTitle: () => (
            <TextBold style={{fontSize: 18}}>My Canvas</TextBold>
          )
        }} 
      />

        <Stack.Screen 
          name="Stock" 
          component={StockScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>Stock</TextBold>
            )
          }} 
        />
        <Stack.Screen 
          name="StockArticle" 
          component={StockArticleScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>Stock Article</TextBold>
            )
          }} 
        />
        <Stack.Screen 
          name="ClientOrdersList" 
          component={ClientOrdersList} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>orders</TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="Clients" 
          component={ClientsScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>Clients</TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="AddStockCategories" 
          component={AddStockCategoriesScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>Select category</TextBold>
            )
          }} 
        />
        <Stack.Screen 
          name="From" 
          component={WhereScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>From where ? </TextBold>
            )
          }} 
        />
        <Stack.Screen 
          name="myproducts" 
          component={MyProductsScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>My Products </TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="AddStockSubcategories" 
          component={AddStockSubcategoriesScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>Select subcategory</TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="AddStockProfiles" 
          component={AddStockProfilesScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>Add Profile</TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="PSOrders" 
          component={ProfileSupplierOrdersScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>Orders</TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="PSOrder" 
          component={ProfileSupplierOrderScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>Order</TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="CRPNTRYProfileOrder" 
          component={CarpentryProfileOrderScreen} 
          options={{
            headerShown: true, 
            headerBackTitleVisible: false,
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>Order</TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="SupplierAccounting" 
          component={SupplierAccountingScreen} 
          options={{
            headerShown: true, 
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>{ i18n.t('accounting.title') }</TextBold>
            )
          }} 
        />

        <Stack.Screen 
          name="CarpentryAccounting" 
          component={CarpentryAccountingScreen} 
          options={{
            headerShown: true, 
            headerTitle: () => (
              <TextBold style={{fontSize: 18}}>{ i18n.t('accounting.title') }</TextBold>
            )
          }} 
        />

        <Stack.Screen name="Logout" component={LogoutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;