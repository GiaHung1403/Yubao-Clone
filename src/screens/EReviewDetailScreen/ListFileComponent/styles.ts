import Color from "@config/Color";
import EStyleSheet from "react-native-extended-stylesheet";

const styles = EStyleSheet.create({
    flatListFile: {
        paddingLeft: 8,
    },

    cardItemListFile: {
        marginTop: 8,
    },

    containerItemListFile: {
        padding: 8,
        alignItems: "center",
    },

    iconFile: {
        width: 50,
        height: 50,
        marginBottom: 8,
    },

    textFileName: {
        fontWeight: "600",
        color: "$primaryColor",
        textAlign: "center",
    },
});

export default styles;
