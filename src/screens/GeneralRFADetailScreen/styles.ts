import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
    containerItemListApprover: {
        padding: 8,
    },

    textEmployeeName: {
        fontWeight: "600",
        fontSize: 16,
        color: "$primaryColor",
        marginLeft: 8,
        flex: 1
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
