import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import DefaultTabs from "../../../components/Tabs/Default";
import AluminiumTab from "../../../components/AlmuniumTab";
import GlassTab from "../../../components/GlassTab";
import VolleTab from "../../../components/VolleTab";
import { Screen } from "../../../components/Containers/Screen";
import ExtensionsTab from "../../../components/ExtensionsTab";

const PricesSettingsScreen = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Screen>
      <ScrollView>
        <View style={styles.container}>
          <DefaultTabs
            tabs={["aluminium", "glass", "vollé", "Extensions"]}
            activeTab={activeTab}
            onChangeTab={setActiveTab}
          />
          {activeTab === 0 && <AluminiumTab />}
          {activeTab === 1 && <GlassTab />}
          {activeTab === 2 && <VolleTab />}
          {activeTab === 3 && <ExtensionsTab />}
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
});

export default PricesSettingsScreen;
