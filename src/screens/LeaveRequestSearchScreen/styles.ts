import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },

  containerBody: {
    flex: 1,
  },

  containerFilter: {
    marginHorizontal: 8,
    zIndex: 2,
    marginTop: 8,
  },

  containerListData: {
    flex: 1,
  },

  containerCardItem: {
    marginHorizontal: 8,
    marginTop: 8,
  },

  viewInCardItem: {
    padding: 8,
  },

  containerRowItemValue: {
    flexDirection: 'row',
    alignItems: "center",
    flex: 1
  },
});

export default styles;
