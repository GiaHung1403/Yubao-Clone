import EStyleSheet from "react-native-extended-stylesheet";

const styles = EStyleSheet.create({
  containerCard: {
    flex: 1,
    marginBottom: "16rem",
  },

  container: {
    flexDirection: "row",
    flex: 1,
  },

  containerContent: {
    flex: 1,
    padding: 8,
  },

  textTitle: {
    fontWeight: "600",
    color: "#3e3e3e",
  },

  textContent: {
    flex: 1,
    marginVertical: 8,
    color: "#555",
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

  labelLogo: {
    fontSize: "12rem",
    color: "#666",
    marginLeft: 4,
  },

  imageCover: {
    width: "120rem",
    height: "100%",
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
});
export default styles;
