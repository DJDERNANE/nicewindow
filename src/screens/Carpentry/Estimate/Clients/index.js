import React, { Component } from 'react';
import { View } from 'react-native';
import { Screen } from '../../../../components/Containers/Screen';
import { ButtonDefault } from '../../../../components/Buttons/Default';
import styles from '../styles';
import i18n from '../../../../../i18n';

class ClientOrder extends Component {
  render() {
    const { route } = this.props;
    const { client } = route.params;

    return (
      <Screen>
        <View style={styles.container}>
          <View style={styles.formControl}>
            <ButtonDefault 
              text={ i18n.t('orders.neworder') }
              onPress={() => this.props.navigation.navigate('Canvas', { client : client })}
            />
          </View>
          <View style={styles.formControl}>
            <ButtonDefault 
              text={ i18n.t('orders.oldorders') }
              onPress={() => this.props.navigation.navigate('ClientOrdersList', { client: client })}
            />
          </View>
        </View>
      </Screen>
    );
  }
}

export default ClientOrder;
