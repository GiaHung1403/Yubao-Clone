import { StatusBar } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import Colors from "../../config/Color";

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  containerHeader: {
    zIndex: 2,
  },

  containerBody: {
    flex: 7,
    zIndex: 1,
  },

  listFeature: {
    flex: 1,
    zIndex: 1,
  },

  containerItem: {
    flex: 1,
  },

  containerImageItem: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    height: 150,
  },

  nameItem: {
    textAlign: "center",
    fontWeight: "600",
    color: "#3e3e3e",
    marginTop: 8,
  },
});

export default styles;
