import EStyleSheet from "react-native-extended-stylesheet";

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },

  containerHeader: {
    zIndex: 2,
  },

  map: {
    flex: 1,
    zIndex: 1,
  },

  /* ========================= Bottom Sheet ============================== */
  containerBottomSheet: {
    backgroundColor: "#fff",
    height: "300rem",
    padding: 8,
  },

  nameLocation: {
    textAlign: "center",
    marginVertical: 12,
    fontSize: "16rem",
    fontWeight: "bold",
  },

  rowText: {
    flexDirection: "row",
    marginVertical: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  labelText: {
    width: "100rem",
    fontWeight: "600",
  },

  valueText: {
    flex: 1,
  },

  containerConnect: {
    marginTop: "8rem",
    justifyContent: "center",
    alignItems: "center",
  },

  labelConnect: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    color: "#8a8a8a",
    marginRight: "8rem",
  },

  containerListButton: {
    flexDirection: "row",
    marginTop: "8rem",
    alignItems: "center",
  },

  iconButton: {
    height: "45rem",
    width: "45rem",
  },

  viewLine: {
    width: 0.5,
    height: "100%",
    backgroundColor: "#8a8a8a",
    marginHorizontal: 4,
  },
});

export default styles;
