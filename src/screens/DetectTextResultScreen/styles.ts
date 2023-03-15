import { Dimensions } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

const widthScreen = Dimensions.get("window").width;

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },

  containerBody: {
    flex: 1,
  },

  flatList: {
    flex: 1,
  },

  buttonAddItem: {
    borderColor: "#3e3e3e",
    margin: 8,
  },

  buttonSubmit: {
    margin: 8,
  },

  containerItem: {
    paddingHorizontal: 4,
    flexDirection: "row",
    flex: 1,
    margin: 4,
    alignItems: "center",
    padding: 8
  },

  textInputItem: {
    color: "#3e3e3e",
    width: (widthScreen / 2)
  },
});

export default styles;
