import { Platform, StatusBar } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

const styles = EStyleSheet.create({
  containerAlert: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },

  modalAlert: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 8,

    "@media ios": {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
    },

    "@media android": {
      elevation: 5,
    },
  },

  textTitle: {
    fontSize: 16,
    fontWeight: "500",
    alignSelf: "center",
    marginVertical: 8,
  },

  message: {
    alignSelf: "center",
    textAlign: "center",
  },

  buttonOK: {
    color: "orange",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },

  modalLoading: {
    zIndex: 999,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    flexDirection: "row",
    backgroundColor: "orange",
    width: "100%",

    "@media android": {
      paddingTop: Platform.Version > 20 ? StatusBar.currentHeight : 0,
    },
  },

  textLoading: {
    color: "white",
    marginLeft: 4,
    paddingVertical: "8rem"
  },
});

export default styles;
