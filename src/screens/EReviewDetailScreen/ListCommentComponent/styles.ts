import EStyleSheet from "react-native-extended-stylesheet";

const styles = EStyleSheet.create({
  flatListApprover: {
    paddingTop: 8,
    flex: 1
  },

  cardItemListApprover: {
    marginTop: 8,
    marginHorizontal: 8
  },

  containerItemListApprover: {
    padding: 8,
  },

  textEmployeeName: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
    color: "$primaryColor",
  },

  textEmployeePosition: {
    fontWeight: "normal",
    fontSize: 14,
  },

  textSendDate: {
    marginVertical: 4,
  },

  containerViewStatus: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },

  textStatus: {
    fontSize: 12,
  },

  circleStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 4,
  },
});

export default styles;
