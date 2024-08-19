import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import { BottomModalContainer } from "./BottomContainer";
import { TextBold, TextMedium } from "../Text";
import { DANGER, DARK_GRAY, PRIMARY, SUCCESS, WHITE } from "../../styles/colors";
import { ButtonDefault } from "../Buttons/Default";
import PropTypes from "prop-types";
import AutoHeightImage from "react-native-auto-height-image";
import { CARPENTRY_API_LINK } from "../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UpdateSubscribtionModal = (props) => {
  const [ packagesData, setPackagesData ] = useState(null);
  const [ packagesLoading, setPackagesLoading ] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const user = await AsyncStorage.getItem('user');

      fetch(CARPENTRY_API_LINK+'/packages', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ JSON.parse(user).api_token
        }
      })
      .then((response) => response.json())
      .then((json) => {
        setPackagesData(json.packages);
        setPackagesLoading(false)
      })
    };

    fetchData();
  }, []);

  return(
    <BottomModalContainer isVisible={props.isVisible}>
      <View style={styles.body}>
        <TextMedium>
          You will choose the package and upload a file that proof the payment.
        </TextMedium>

        <TextBold style={styles.packageTitle}>Package:</TextBold>
        <View style={styles.packageView}>
          {packagesLoading ?
            <ActivityIndicator size={'large'} color={PRIMARY} />
          :
            packagesData && packagesData.length > 0 &&
              packagesData.map((data, key) => {
                return(
                  <Pressable
                    style={[styles.packageItem, props.selectedPackage === data.id && {backgroundColor: PRIMARY}]}
                    onPress={() => props.onPackageChange(data.id)}
                    key={key}
                  >
                    <TextMedium 
                      style={[styles.packageText, props.selectedPackage === data.id && {color: WHITE}]}
                    >
                      {data.name_en} {data.monthly_price} DZD/m
                    </TextMedium>
                  </Pressable>
                );
              })
          }
        </View>

        <TextBold style={styles.delayTitle}>Subscribe for:</TextBold>
        <View style={styles.delayView}>
          <Pressable 
            style={[styles.delayItem, props.selectedDelay === 1 && {backgroundColor: PRIMARY}]} 
            onPress={() => props.onDelayChange(1)}
          >
            <TextMedium style={[styles.delayText, props.selectedDelay === 1 && {color: WHITE}]}>1 Month</TextMedium>
          </Pressable>

          <Pressable 
            style={[styles.delayItem, props.selectedDelay === 6 && {backgroundColor: PRIMARY}]} 
            onPress={() => props.onDelayChange(6)}
          >
            <TextMedium style={[styles.delayText, props.selectedDelay === 6 && {color: WHITE}]}>6 Months</TextMedium>
          </Pressable>

          <Pressable 
            style={[styles.delayItem, props.selectedDelay === 12 && {backgroundColor: PRIMARY}]} 
            onPress={() => props.onDelayChange(12)}
          >
            <TextMedium style={[styles.delayText, props.selectedDelay === 12 && {color: WHITE}]}>1 Year</TextMedium>
          </Pressable>
        </View>

        {props.image ?
          <TouchableOpacity onPress={props.onPickImage}>
            <AutoHeightImage 
              source={{uri: props.image}} 
              width={Dimensions.get('screen').width-40} 
            />
          </TouchableOpacity>
        :
          <TouchableOpacity onPress={props.onPickImage}>
            <Feather name="image" size={Dimensions.get('screen').width-40} color={DARK_GRAY} />
          </TouchableOpacity>
        }
      </View>

      <View style={styles.footer}>
        <ButtonDefault 
          text={'Cancel'} 
          color={DANGER} 
          containerStyle={styles.footerButton} 
          onPress={props.onCancel}
        />

        <ButtonDefault 
          text={'Send'} 
          color={SUCCESS} 
          containerStyle={styles.footerButton} 
          onPress={props.onSend}
          disabled={!props.image || !props.selectedDelay || !props.selectedPackage}
        />
      </View>
    </BottomModalContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    marginBottom: 22
  },
  delayTitle: {
    fontSize: 16,
    marginTop: 20
  },
  packageTitle: {
    fontSize: 16,
    marginTop: 20
  },
  delayView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginVertical: 10
  },
  delayItem: {
    borderWidth: 1,
    borderColor: PRIMARY,
    padding: 10,
    width: Dimensions.get('window').width/3-20
  },
  packageView: {
    marginVertical: 10
  },
  packageItem: {
    borderWidth: 1,
    borderColor: PRIMARY,
    padding: 10,
    marginTop: 10
  },
  delayText: {
    textAlign: 'center'
  },
  packageText: {
    textAlign: 'center',
    fontSize: 16
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerButton: {
    width: Dimensions.get('window').width/2-30
  }
});

UpdateSubscribtionModal.propTypes = {
  isVisible: PropTypes.bool,
  onPickImage: PropTypes.func,
  onCancel: PropTypes.func,
  onSend: PropTypes.func,
  image: PropTypes.any,
  onDelayChange: PropTypes.func,
  selectedDelay: PropTypes.number,
  selectedPackage: PropTypes.number,
  onPackageChange: PropTypes.func
}