import { StatusBar } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

const styles = EStyleSheet.create({
  $primaryColorApp: "$primaryColor",

  containerBackgroundBack: {
    flex: 0,
    backgroundColor: "$primaryColor",

    "@media android": {
      paddingTop: StatusBar.currentHeight,
      elevation: 4,
      paddingBottom: 8,
    },
    "@media ios": {
      shadowColor: "black",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 2,
    },
  },

  containerBack: {
    height: 44,
    padding: 8,
    flexDirection: "row",
    alignItems: "center"
  },

  buttonBack: {
    paddingRight: "16rem",
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },

  iconButtonBack: {
    width: 16,
    height: 16,
    tintColor: "#fff",
  },
});

export default styles;
