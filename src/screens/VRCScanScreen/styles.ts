import EStyleSheet from "react-native-extended-stylesheet";

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: "center",
  },
  pickerStyle: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingLeft: 15,
    paddingVertical: 20,
    marginBottom: 4,
    backgroundColor: "white",
  },

  pickerStyle2: {
    justifyContent: "space-between",
    paddingVertical: 30,
    paddingHorizontal: 15,
    borderWidth: 0.2,
    backgroundColor: "white",
  },
});

export default styles;
