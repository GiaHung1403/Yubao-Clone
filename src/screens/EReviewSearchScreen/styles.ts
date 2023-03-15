import EStyleSheet from "react-native-extended-stylesheet";

const styles = EStyleSheet.create({
  rowForm: {
    flexDirection: "row",
    marginBottom: 12
  },

  textInputLeft: {
    flex: 1,
    height: 40,
    textAlign: "right",
  },

  picker: {
    borderWidth: 0.5,
    borderColor: "#3e3e3e",
    height: 42,
    marginTop: 6,
    backgroundColor: "#f6f6f6",
    width: "100%"
  },

  textInputRight: {
    flex: 1,
    height: 40,
    marginLeft: 8,
  },
});

export default styles;
