
import { Dimensions, StyleSheet, View, Button, TouchableOpacity, Text } from "react-native";
import { BottomModalContainer } from "./BottomContainer";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ButtonDefault } from "../Buttons/Default";
import { DANGER, SUCCESS } from "../../styles/colors";
import Radiostyles from "../Modals/style";
import { useState } from "react";
import { DefaultInput } from "../Inputs/default";




export default FilterModal = (props) => {
    const [day, setDay] = useState(false);

    return (
        <BottomModalContainer isVisible={props.isVisible} onBackdropPress={props.onCancel}>
            <View>
                <TouchableOpacity style={[
                    Radiostyles.option,
                    !day && Radiostyles.selectedOption,
                ]} onPress={() => setDay(!day)}>
                    <Text >يوم واحد </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[
                    Radiostyles.option,
                    day && Radiostyles.selectedOption,
                ]} onPress={() => setDay(!day)}>
                    <Text >أكثر من يوم</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginBottom: 20 }}>
                <View style={{ marginVertical: 10 }}>
                    <View>
                        <Text >
                            day :
                        </Text>
                        <Text style={Radiostyles.option}>
                            {props.oneDay}
                        </Text>
                    </View>
                    <Button title="Show Date Picker" onPress={props.showDatePicker} />
                    <DateTimePickerModal
                        isVisible={props.isDatePickerVisible}
                        mode="date"
                        onConfirm={props.handleConfirmStartday}
                        onCancel={props.hideDatePicker}
                    />
                </View>
                {
                    day ?
                        (
                            <View style={{ marginVertical: 10 }}>
                                <View>
                                    <Text >
                                        to :
                                    </Text>
                                    <Text style={Radiostyles.option}>
                                        {props.endDay}
                                    </Text>
                                </View>
                                <Button title="Show Date Picker" onPress={props.showEndDatePicker} />
                                <DateTimePickerModal
                                    isVisible={props.isEndDatePickerVisible}
                                    mode="date"
                                    onConfirm={props.handleConfirmEndday}
                                    onCancel={props.hideEndDatePicker}
                                />
                            </View>
                        ) : ''
                }
            </View>
            <View>

            </View>
            <View style={styles.footer}>
                <ButtonDefault
                    text={'Cancel'}
                    color={DANGER}
                    containerStyle={styles.footerButton}
                    onPress={props.onExit}
                />

                <ButtonDefault
                    text={'Save'}
                    color={SUCCESS}
                    containerStyle={styles.footerButton}
                    onPress={props.onFilter}
                />
            </View>
        </BottomModalContainer >
    );
}

const styles = StyleSheet.create({

    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    footerButton: {
        width: Dimensions.get('window').width / 2 - 30
    }
});

