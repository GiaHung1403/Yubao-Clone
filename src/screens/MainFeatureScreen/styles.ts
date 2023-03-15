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
    elevation: 2
  },

  containerBody: {
    flex: 9,
    zIndex: 1,
  },

  listFeature: {
    flex: 1,
    zIndex: 1,
    backgroundColor: "transparent"
  },

  containerItem: {
  },

  containerImageItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  imageItem: {
    fontSize: "35rem",
    color: "#fff",
  },

  nameItem: {
    textAlign: "center",
    color: "#fff",
    marginTop: 8,
  },
});

export default styles;
