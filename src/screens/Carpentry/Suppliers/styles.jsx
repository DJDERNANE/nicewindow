import { StyleSheet } from 'react-native';
import { PRIMARY, WHITE } from '../../../styles/colors';

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    marginBottom: 10
  },
  moreText: {
    color: PRIMARY
  },
  checkbox: {
    backgroundColor: WHITE,
    marginBottom: 10,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#171717',
    shadowOffset: {width: -1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  },
  checkboxText: {
    fontSize: 16
  },
  searchButton: {
    marginTop: 10
  }
});

export default styles;