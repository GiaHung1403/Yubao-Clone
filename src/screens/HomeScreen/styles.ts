import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  containerHeader: {
    zIndex: 2,
  },

  containerBody: {
    flex: 1,
    zIndex: 1,
  },

  containerScrollView: {
    flex: 1,
  },

  cardFilter: {
    marginHorizontal: 8,
    marginBottom: 8,
    marginTop: 12
  },

  containerFilter: {
    padding: 8,
    flexDirection: "row",
  },

  containerInfoFilter: {
    flex: 1,
  },

  containerInfoFilterRow: {
    flexDirection: "row",
    marginBottom: 4,
  },

  circleColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },

  textLabelInfoFilter: {
    fontSize: 12,

    "@media android": {
      color: "#000",
    },
  },

  textValueInfoFilter: {
    "@media android": {
      fontWeight: "700",
    },

    "@media ios": {
      fontWeight: "600",
    },
  },

  /* Commence & NPV */
  containerCommenceNPV: {
    flexDirection: "row",
    marginHorizontal: 8,
  },

  cardItemCommenceNVP: {
    flex: 1,
  },

  containerItemCommenceNPV: {
    padding: 8,
    flexDirection: "row",
  },

  iconCommenceNPV: {
    width: 70,
    height: 70,
  },

  labelCommenceNPV: {
    "@media android": {
      fontWeight: "700",
    },

    "@media ios": {
      fontWeight: "600",
      color: "#555",
    },
  },

  viewRightItemCommenceNPV: {
    flex: 1,
    alignItems: "flex-end",
  },

  viewValueRightItemCommenceNPV: {
    alignItems: "flex-end",
  },

  textValueRightItemCommenceNPV: {
    color: "$primaryColor",
    fontSize: 15,
    "@media android": {
      fontWeight: "700",
    },

    "@media ios": {
      fontWeight: "600",
    },
  },

  textLabelRightItemCommenceNPV: {
    fontSize: 11,
    "@media ios": {
      color: "#555",
    },
  },

  labelChartColumn: {
    textAlign: "center",
    marginTop: 8,
    "@media android": {
      fontWeight: "700",
    },

    "@media ios": {
      fontWeight: "600",
      color: "#555",
    },
  },

  labelRecoveryDelinquent: {
    "@media android": {
      fontWeight: "700",
    },

    "@media ios": {
      fontWeight: "600",
      color: "#555",
    },
    marginTop: 8,
  },

  valueRecoveryDelinquent: {
    "@media android": {
      fontWeight: "700",
      fontSize: 20,
    },

    "@media ios": {
      fontWeight: "600",
      fontSize: 24,
    },
    color: "$primaryColor",
  },

  labelCustomerInsurance: {
    textAlign: "center",
    marginTop: 8,
    "@media android": {
      fontWeight: "700",
    },

    "@media ios": {
      fontWeight: "600",
    },
  },
});

export default styles;
