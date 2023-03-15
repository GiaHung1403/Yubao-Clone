import { Platform, StatusBar } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { isIPad } from "@utils/deviceInfo";

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
    marginVertical: "24rem",
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

  containerButtonForgotPass: {
    alignSelf: "flex-end",
  },

  labelButtonForgotPass: {
    color: "$primaryColor",
    alignSelf: "center",
    marginTop: "16rem",
    paddingLeft: "16rem",
    fontSize: "12rem",
  },

  containerButtonLogin: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },

  buttonStartUsing: {
    marginTop: 16,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  labelButtonStartUsing: {
    color: "$primaryColor",
    fontWeight: "500",
  },
});

export default styles;
