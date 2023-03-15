import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    flexDirection: "row",
    paddingBottom: 8,
    alignItems: "center",
  },

  iconLeft: {
    fontSize: 20,
    color: "#999",
    marginRight: 12,
  },

  textInput: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 40,
  },
});
export default styles;
