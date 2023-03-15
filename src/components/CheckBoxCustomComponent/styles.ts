import EStyleSheet from 'react-native-extended-stylesheet';
import Colors from '../../config/Color';

const styles = EStyleSheet.create({
  labelButtonChooseDate: {
    fontWeight: '600',
    color: '#555',
    marginBottom: 4
  },

  contentButtonChooseDate: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#666',
    padding: 8,
    borderRadius: 4,
    height: 42,
  },

  valueButtonChooseDate: {
    fontWeight: '600',
    color: '#555'
  }
});

export default styles;
