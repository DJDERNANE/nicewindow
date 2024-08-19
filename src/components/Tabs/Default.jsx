import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { TextMedium } from "../Text";
import { PRIMARY, WHITE } from "../../styles/colors";
import PropTypes from 'prop-types';

const DefaultTabs = (props) => {
  return(
    <View style={styles.container}>
      {props.tabs &&
        props.tabs.map((data, key) => {
          return(
            <Pressable 
              style={
                [
                  styles.tab, 
                  props.activeTab === key && 
                  {
                    backgroundColor: PRIMARY
                  },{width: `${100 / props.tabs.length}%`}
                ]
              } 
              key={key}
              onPress={() => props.onChangeTab(key)}
            >
              <TextMedium style={[styles.tabText, props.activeTab === key && {color: WHITE}]}>
                {data}
              </TextMedium>
            </Pressable>
          );
        })
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: WHITE,
    marginBottom: 20,
    shadowColor: '#171717',
    shadowOffset: {width: -1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  },
  tab: {
    padding: 10,
    
  },
  tabText: {
    textAlign: 'center'
  }
});

DefaultTabs.propTypes = {
  tabs: PropTypes.array,
  activeTab: PropTypes.number,
  onChangeTab: PropTypes.func
}

export default DefaultTabs;