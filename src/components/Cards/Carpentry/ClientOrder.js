import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TextBold, TextMedium } from "../../Text";
import { DANGER, DARK_GRAY, WHITE, WARNING, SUCCESS } from "../../../styles/colors";
import { useNavigation } from "@react-navigation/native";
import { ButtonDefault } from "../../Buttons/Default";

export const ClientOrder = ({ id,client, price, date, paye, credit, onPaye }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('CanvasClient', { client: client, total: price, id:id })}>

            <View style={styles.clientNameView}>
                <TextBold> La date d'achat :   {date.split('T')[0]} </TextBold>
            </View>
            <TextMedium style={styles.detailsText}>
                Prix Total : {price} DZD
            </TextMedium>
            <TextMedium style={styles.detailsText}>
                Paye: {paye} DZD
            </TextMedium>
            <TextMedium style={styles.detailsText}>
                Il reste: {credit} DZD
            </TextMedium>
            <ButtonDefault
                text={'Paye'}
                size="sm"
                color={credit == 0 ? SUCCESS : WARNING}
                onPress={credit == 0 ? console.log('paye') : onPaye }
                
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: WHITE,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#171717',
        shadowOffset: { width: -1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2
    },
    clientNameView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    clientName: {
        fontSize: 16,
        marginBottom: 4
    },
    detailsText: {
        color: DARK_GRAY
    }
});