
import { Dimensions, StyleSheet, View, TouchableOpacity, Text, FlatList, ScrollView } from "react-native";
import { DANGER, LIGHT, SUCCESS } from "../../styles/colors";
import { ButtonDefault } from "../Buttons/Default";
import { Label } from "../Forms/Label";
import { DefaultInput } from "../Inputs/default";
import PropTypes from "prop-types";
import { BottomModalContainer } from "./BottomContainer";
import Radiostyles from "./style";




export default  addClientModal = (props) => {

    return (
        <BottomModalContainer isVisible={props.isVisible} onBackdropPress={props.onCancel}>
            <ScrollView>
                <View style={styles.body}>
                    <View style={styles.formGroup}>
                        <Label required>Nom : </Label>
                        <DefaultInput
                            style={styles.input}
                            onChangeText={props.onChangeName}
                            value={String(props.name)}
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <Label required>Email : </Label>
                        <DefaultInput
                            style={styles.input}
                          
                            onChangeText={props.onChangeEmail}
                            value={String(props.email)}
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <Label required>Numero Telephone : </Label>
                        <DefaultInput
                            style={styles.input}
                            keyboardType={'number-pad'}
                            onChangeText={props.onChangePhone}
                            value={String(props.phone)}
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <Label required>Nom d'entreprise  : </Label>
                        <DefaultInput
                            style={styles.input}
                           
                            onChangeText={props.onChangeCompany}
                            value={String(props.company)}
                        />
                    </View>
                   
                </View>
                <View style={styles.footer}>
                    <ButtonDefault
                        text={'Cancel'}
                        color={DANGER}
                        containerStyle={styles.footerButton}
                        onPress={props.onCancel}
                    />

                    <ButtonDefault
                        text={'Save'}
                        color={SUCCESS}
                        containerStyle={styles.footerButton}
                        onPress={props.onConfirm}
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
    }
});

