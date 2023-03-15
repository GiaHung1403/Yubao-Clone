import {Platform, StatusBar} from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  button: {
    alignItems: "center",
    height: 70,
    justifyContent: "center",
    width: 65,
  },
  buttonActionGroup: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  buttonBottomContainer: {
    alignItems: "flex-end",
    bottom: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    left: 25,
    position: "absolute",
    right: 25,
  },
  buttonContainer: {
    alignItems: "flex-end",
    bottom: 25,
    flexDirection: "column",
    justifyContent: "space-between",
    position: "absolute",
    right: 25,
    top: 25,
  },
  buttonGroup: {
    backgroundColor: "#00000080",
    borderRadius: 17,
  },
  buttonIcon: {
    color: "white",
    fontSize: 22,
    marginBottom: 3,
    textAlign: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 13,
  },
  buttonTopContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    left: 25,
    position: "absolute",
    right: 25,
    top: 40,
  },
  cameraButton: {
    backgroundColor: "white",
    borderRadius: 50,
    flex: 1,
    margin: 3,
  },
  cameraNotAvailableContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 15,
  },
  cameraNotAvailableText: {
    color: "white",
    fontSize: 25,
    textAlign: "center",
  },
  cameraOutline: {
    borderColor: "white",
    borderRadius: 50,
    borderWidth: 3,
    height: 70,
    width: 70,
  },
  container: {
    backgroundColor: "black",
    flex: 1,
  },
  flashControl: {
    alignItems: "center",
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    margin: 8,
    paddingTop: 7,
    width: 50,
  },
  loadingCameraMessage: {
    color: "white",
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    bottom: 0,
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  processingContainer: {
    alignItems: "center",
    backgroundColor: "rgba(220, 220, 220, 0.7)",
    borderRadius: 16,
    height: 140,
    justifyContent: "center",
    width: 200,
  },
  scanner: {
    flex: 1,
  },
});
export default styles;
