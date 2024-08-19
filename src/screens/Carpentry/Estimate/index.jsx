import React, { Component } from 'react';
import { View } from 'react-native';
import { Screen } from '../../../components/Containers/Screen';
import { ButtonDefault } from '../../../components/Buttons/Default';
import styles from './styles';
import i18n from '../../../../i18n';

class EstimateScreen extends Component {
  render() {
    return(
      <Screen>
        <View style={styles.container}>
          <View style={styles.formControl}>
            <ButtonDefault 
              text={ i18n.t('new_order.buttons.new_client') } 
              onPress={() => this.props.navigation.navigate('AddClient')} 
            />
          </View>
          <View style={styles.formControl}>
            <ButtonDefault 
              text={ i18n.t('new_order.buttons.from_database') } 
              onPress={() => this.props.navigation.navigate('EstimateClients')} 
            />
          </View>
        </View>
      </Screen>
    );
  }
}

export default EstimateScreen;