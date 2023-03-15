import React from "react";

export const PreferencesContext = React.createContext({
  toggleTheme: (data: any) => {},
  isTheme: false,
  newColor: "",
  newTheme : undefined,
  newHeader : undefined,
});
