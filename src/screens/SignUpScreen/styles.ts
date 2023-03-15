import { Platform, StatusBar } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { isIPad } from "../../utils/deviceInfo";

const styles = EStyleSheet.create({
  container: {
    padding: "8rem",
    flex: 1,
    marginTop: isIPad() ? "-200rem" : "20rem",
    justifyContent: isIPad() ? "center" : "flex-start",
  },

  containerForm: {
    "@media ios": {
      marginVertical: "20rem",
    },
    padding: 8,
    maxWidth: "500rem",
    width: "100%",
    alignSelf: "center"
  },

  logo: {
    width: "100rem",
    height: "100rem",
    alignSelf: "center",
  },

  containerHeader: {
    marginTop: "20rem",
    justifyContent: "center",
    alignItems: "center",
  },

  textNameCompany: {
    fontSize: "24rem",
    fontWeight: "600",
    color: "#555",
  },

  textSubTitleHeader: {
    textAlign: "center",
    color: "#555",
    marginTop: 8,
  },

  buttonLoginFingerprint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  iconFingerprint: {
    width: "30rem",
    height: "30rem",
    tintColor: "$primaryColor",
    marginRight: "8rem",
  },

  containerButtonLogin: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
});

export default styles;
