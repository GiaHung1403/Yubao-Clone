import EStyleSheet from "react-native-extended-stylesheet";

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },

  containerHeader: {
    zIndex: 2,
  },

  containerBody: {
    zIndex: 1,
  },

  containerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
});

export default styles;
