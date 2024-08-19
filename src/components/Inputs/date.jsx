import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import DateTimePicker from "react-native-modal-datetime-picker";
import PropTypes from 'prop-types';
import { WHITE } from '../../styles/colors';

class DateTimeInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false
    }

    this.onChange = this.onChange.bind(this);
  }

  onChange(date) {
    this.props.onChange(date);
    this.setState({
      show: !this.state.show
    });
  }

  render() {
    const p = this.props;
    const s = this.state;

    return(
      <View>
        <TouchableOpacity style={styles.container} onPress={() => this.setState({show: !s.show})}>
          <Text style={styles.text}>
            {p.mode == 'date' ? 
              p.date === null ?
                'DD/MM/YYYY'
                :
                `${p.date.getDate()}/${p.date.getMonth()+1}/${p.date.getFullYear()}` 
              : 
              p.date === null ?
                'HH:MM'
                :
                `${(p.date.getHours()<10?'0':'')+p.date.getHours()}: ${(p.date.getMinutes()<10?'0':'')+p.date.getMinutes()}`
            }
          </Text>

          <Icon name={p.mode == 'date' ? 'calendar' : 'clockcircleo'} size={22} />
        </TouchableOpacity>

        <DateTimePicker 
          isVisible={s.show}
          onConfirm={(date) => this.onChange(date)}
          onCancel={() => this.setState({show: false})}
          mode={p.mode}
          is24Hour={true}
          date={p.date === null ? new Date() : p.date}
          cancelTextIOS={'Annuler'}
          confirmTextIOS={'Confirmer'}
          minimumDate={p.minimumDate}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    paddingVertical: 16,
    paddingHorizontal: 14,
    justifyContent: 'space-between',
    shadowColor: '#171717',
    shadowOffset: {width: -1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  },
  text: {
    fontSize: 16,
    alignSelf: 'center'
  }
});

DateTimeInput.propTypes = {
  mode: PropTypes.string,
  onChange: PropTypes.func
}

export default DateTimeInput;