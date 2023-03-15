import React, { useEffect, useState } from "react";
import { configureFonts, DefaultTheme, Provider } from "react-native-paper";
import Colors from "./Color";
import { PreferencesContext } from "@context/PreferencesContext";
import EventEmitter from "@utils/events";

const fontConfig = {
  default: {
    regular: {
      fontFamily: "System",
      fontWeight: "400" as "400",
    },
    medium: {
      fontFamily: "System",
      fontWeight: "500" as "500",
    },
    light: {
      fontFamily: "System",
      fontWeight: "300" as "300",
    },
    thin: {
      fontFamily: "System",
      fontWeight: "100" as "100",
    },
  },
};

//changeColor()
const theme = (color) => ({
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: color || Colors.main,
    accent: color || Colors.main,
    // surface:Colors.backgroundHome1,
  },
  fonts: configureFonts(fontConfig),
});

const customTheme = {
  ...DefaultTheme,
  dark: false,
  roundness: 4,
  colors: {
    ...DefaultTheme.colors,
    primary: "#A6CAA6",
    accent: "#A6CAA6",
    background: "#F1F7ED",
    surface: "#F1F7ED",
    text: "#001021",
    error: "#B71F0E",
    disabled: "#BEC6C6",
    placeholder: "#1481BA",
    backdrop: "#001021",
  },
  fonts: configureFonts(fontConfig),
};

// export default class PaperProvider extends React.Component {
//   render() {
//     return <Provider theme={theme}>{this.props.children}</Provider>;
//   }
// }
const PaperProvider = props => {
  const {newColor} = React.useContext(PreferencesContext)

  //const colors = React.useContext(PreferencesContext);
  const [getTheme, setTheme] = useState(theme(null));

  useEffect(() => {setTheme(theme(newColor))},[newColor])

  return <Provider theme={getTheme}>{props.children}</Provider>;
};

export default PaperProvider;
