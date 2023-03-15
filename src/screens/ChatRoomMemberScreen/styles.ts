import EStyleSheet from "react-native-extended-stylesheet";

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },

  containerHeader: {
    zIndex: 2,
  },

  containerList: {
    zIndex: 1,
  },

  buttonLogout: {
    marginTop: 8,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  labelButtonLogout: {
    color: "red",
    fontSize: 16,
  },

  containerHeaderList: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#fff",
  },

  containerInfoUser: {
    marginLeft: 8,
  },

  textUsername: {
    color: "#3e3e3e",
    fontWeight: "bold",
  },

  textEmail: {
    color: "#3e3e3e",
  },

  containerWelcome: {
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },

  containerLeftWelcome: {
    flex: 1,
  },

  textWelcome: {
    color: "#3e3e3e",
  },

  textLogin: {
    fontSize: 16,
    paddingVertical: 4,
    color: "$primaryColor",
    fontWeight: "bold",
  },

  iconRightWelcome: {
    width: 16,
    height: 16,
    tintColor: "$primaryColor",
  },

  viewLine: {
    height: 0.5,
    marginHorizontal: 16,
    backgroundColor: "#ddd",
  },

  containerItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  iconItem: {
    width: 24,
    height: 24,
    tintColor: "#3e3e3e",
  },

  textNameItem: {
    color: "#3e3e3e",
    fontWeight: "500",
    marginLeft: 16,
    flex: 1,
  },

  iconRightItem: {
    width: 16,
    height: 16,
    tintColor: "#8a8a8a",
  },
});

export default styles;
