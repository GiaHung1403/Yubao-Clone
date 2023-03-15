import EStyleSheet from 'react-native-extended-stylesheet';
import Color from '../../config/Color';
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
    borderColor: "#66666650",
    padding: 8,
    borderRadius: 4,
    height: 42,
  },

  valueButtonChooseDate: {
    fontWeight: '500',
    color: '#555555',
    flex: 1
  }
});

export default styles;
