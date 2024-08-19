
import { Dimensions, StyleSheet, View, TouchableOpacity, Text, FlatList, ScrollView } from "react-native";
import { DANGER, LIGHT, SUCCESS,WHITE } from "../../styles/colors";
import { ButtonDefault } from "../Buttons/Default";
import { Label } from "../Forms/Label";
import { DefaultInput } from "../Inputs/default";
import PropTypes from "prop-types";
import { BottomModalContainer } from "./BottomContainer";
import Radiostyles from "./style";

export const SpendsDetails = (props) => {

    return (
        <BottomModalContainer   isVisible={props.isVisible} onBackdropPress={props.onCancel}>
            <ScrollView>
                <View style={styles.body}>
                <FlatList
                    data={props.data}
                    renderItem={props.renderItem}
                    //keyExtractor={(item) => item.id}
                />
                </View>
                <View style={styles.footer}>
                    <ButtonDefault
                        text={'Cancel'}
                        color={DANGER}
                        containerStyle={styles.footerButton}
                        onPress={props.onCancel}
                    />
                </View>
            </ScrollView>

        </BottomModalContainer>
    );
}

const styles = StyleSheet.create({
    body: {
        marginBottom: 22
    },
    formGroup: {
        marginBottom: 20
    },
    input: {
        backgroundColor: LIGHT
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    footerButton: {
        width: Dimensions.get('window').width / 2 - 30
    },
    container: {
        padding: 20,
        backgroundColor: WHITE,
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
        width: Dimensions.get('screen').width/2-50
      }
});

