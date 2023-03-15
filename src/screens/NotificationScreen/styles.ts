import EStyleSheet from "react-native-extended-stylesheet";

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  listNotification: {
    paddingTop: "8rem",
  },

  containerItem: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "#fff",
  },

  logo: {
    width: "24rem",
    height: "24rem",
    margin: "8rem",
  },

  containerContent: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e5e5",
    paddingVertical: "8rem",
    paddingRight: "8rem",
    flex: 1,
  },

  containerContentLast: {
    paddingVertical: "8rem",
    paddingRight: "8rem",
    flex: 1,
  },
});

export default styles;

