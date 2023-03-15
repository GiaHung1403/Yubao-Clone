import EStyleSheet from "react-native-extended-stylesheet";
import { isIPad } from "../../../utils/deviceInfo";

const styles = EStyleSheet.create({
  containerCard: {
    marginLeft: 8,
  },

  containerImage: {
    width: "100%",
    height: "200rem",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },

  containerContent: {
    padding: 8,
    maxWidth: isIPad() ? "400rem" : "280rem",
    flex: 1
  },

  title: {
    marginBottom: 8,
    fontWeight: "600",
    color: "#3e3e3e",
  },

  content: {
    color: "#555",
    flex: 1,
  },

  containerLogo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  logo: {
    width: "24rem",
    height: "24rem",
  },

  createAt: {
    fontSize: "12rem",
    color: "#666",
    marginLeft: 4,
  },
});
export default styles;
