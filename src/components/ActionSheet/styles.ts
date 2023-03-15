import { StyleSheet } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export const ITEM_HEIGHT = 48;

export default EStyleSheet.create({
  container: {
    overflow: 'hidden',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },

  item: {
    paddingHorizontal: 16,
    height: ITEM_HEIGHT,
    alignItems: 'center',
    flexDirection: 'row'
  },

  separator: {
    marginHorizontal: 16
  },

  content: {
    padding: 8
  },

  title: {
    fontSize: 16,
    marginLeft: 16,
  },

  handle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 8
  },

  handleIndicator: {
    width: 40,
    height: 4,
    borderRadius: 4,
    margin: 8
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject
  },

  button: {
    marginHorizontal: 16,
    paddingHorizontal: 14,
    justifyContent: 'center',
    height: ITEM_HEIGHT,
    borderRadius: 2,
    marginBottom: 12
  },

  text: {
    fontSize: 16,
  }
});
