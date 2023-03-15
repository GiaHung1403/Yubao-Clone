import { Dimensions } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

const widthScreen = Dimensions.get("screen").width;
const widthItemContract = widthScreen - 60;

const styles = EStyleSheet.create({
  container: {
    borderRadius: 4,
    paddingVertical: 8,
    backgroundColor: "$primaryColor",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    marginTop: "8rem",
  },

  circleLeft: {
    position: "absolute",
    top: 100 / 2,
    width: widthItemContract,
    aspectRatio: 1,
    borderRadius: widthItemContract / 2,
    opacity: 0.08,
    backgroundColor: "#ffffff",
  },

  circleBottom: {
    position: "absolute",
    left: -((widthItemContract / 3) * 2),
    width: widthItemContract,
    aspectRatio: 1,
    borderRadius: widthItemContract / 2,
    opacity: 0.08,
    backgroundColor: "#ffffff",
  },

  containerContentRight: {
    paddingHorizontal: "8rem",
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  /* ================================== View Title ================================= */
  containerViewTitle: {
    flexDirection: "row",
    alignItems: "center",
  },

  lineLeft: {
    height: 0.5,
    backgroundColor: "#ddd",
    marginVertical: 8,
    width: 30,
  },

  titleCenter: {
    marginHorizontal: 8,
    fontWeight: "600",
    fontSize: 16,
    color: "orange",
  },

  lineRight: {
    flex: 1,
    height: 0.5,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },

  /* ================================== Left content ================================ */
  containerContentLeft: {
    paddingHorizontal: "8rem",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  containerRowLeft: {
    flexDirection: "row",
    paddingVertical: 2,
    alignItems: "center",
  },

  iconLeft: {
    width: 24,
    height: 24,
    marginRight: 8,
  },

  textLabel: {
    color: "#fff",
    marginVertical: 4,
  },

  textContractNoValue: {
    fontWeight: "600",
    color: "orange",
    fontSize: 16
  },
});

export default styles;
