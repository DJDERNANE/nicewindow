import React from "react";
import { Dimensions, Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { ButtonDefault } from "../Buttons/Default";
import { DANGER, SUCCESS, WHITE } from "../../styles/colors";
import { TextBold, TextMedium } from "../Text";
import { MAIN_LINK } from "../../utils/constants";

export const ClientCard = (props) => {
    return (
        <TouchableOpacity style={styles.container} onPress={props.clientDetails}>
            <View style={styles.header}>

                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>Nom : </Text><TextBold>  {props.data.name}  </TextBold>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>Email : </Text><TextBold>  {props.data.email}</TextBold>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>Entreprise : </Text><TextBold>  {props.data.company_name}</TextBold>
                    </View>
                </View>
            </View>
            <View style={styles.buttons}>
                {props.activeTab === 0 ? (
                    <ButtonDefault
                    text="Delete"
                    size="sm"
                    color={DANGER}
                    containerStyle={styles.button}
                    onPress={props.onDestroy}
                />
                ): ''}
               
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
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
        justifyContent: 'center'
    },
    button: {
        width: Dimensions.get('screen').width / 2 - 50
    }
});