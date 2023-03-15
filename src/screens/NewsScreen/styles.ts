import { isIPad } from "@utils/deviceInfo";
import EStyleSheet from "react-native-extended-stylesheet";

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  containerBody: {
    zIndex: 1,
    flex: 1,
  },

  containerNewsSlide: {
    marginTop: 8,
    flexDirection: "row",
    paddingBottom: 8,
  },

  containerNews: {
    flexDirection: isIPad() ? "row" : "column",
  },


  containerContentNews: {
    padding: 8,
    flex: 1,
    marginTop: 8,
    marginBottom: 16,
    fontWeight: "600",
    fontSize: "18rem",
    color: "$primaryColor",
  },

  labelContentNews: {
    marginTop: 8,
    marginBottom: 16,
    fontWeight: "600",
    fontSize: "18rem",
    color: "$primaryColor",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default styles;
