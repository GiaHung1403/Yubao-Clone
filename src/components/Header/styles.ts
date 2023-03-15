import { StatusBar } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

const styles = EStyleSheet.create({
  $primaryColorApp: "$primaryColor",

  cardHeader: {
    "@media android": {
      paddingTop: StatusBar.currentHeight,
      elevation: 4,
    },
    "@media ios": {
      shadowColor: "black",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 2,
    },
  },

  containerBackgroundBack: {
    flex: 0,
  },

  containerBack: {
    alignItems: "center",
    padding: 8,
    height: "46rem",
    justifyContent: "center",
  },

  buttonBack: {
    position: "absolute",
    left: 8,
    paddingRight: "60rem",
    flexDirection: "row",
    alignItems: "center",
    height: "40rem",
    zIndex: 2
  },

  iconButtonBack: {
    width: 16,
    height: 16,
    tintColor: "#fff",
  },
});

export default styles;
