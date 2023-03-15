// import { Colors } from "react-native-paper";

// const Color = {
//   main: "#9b59b6",  // 9b59b6 6CB374
//   background: "#bf95d0", // bf95d0 A6CAA6
//   status: "#cfa531",
//   backgroundAlpha: "#dfcae8",
//   icon: "#cfa531",
//   backgroundHome1: "#F8F9F9",
//   waiting: Colors.yellow700,
//   reject: Colors.red500,
//   approved: "#2c82c9",
//   draft: "#829394"
// };

// export default Color;

import React, { useContext } from "react";
import { Colors } from "react-native-paper";
import AsyncStorage from "@data/local/AsyncStorage";

// const getColorMain = async () =>{
// return await AsyncStorage.getColor();
// }

let Color = {
	main: '#9b59b6', // 9b59b6 6CB374 33ccc7
	background: '#bf95d0', // bf95d0 A6CAA6
	status: '#cfa531',
	backgroundAlpha: '#dfcae8',
	icon: '#cfa531',
	backgroundHome1: '#F8F9F9',
	waiting: Colors.yellow700,
	reject: Colors.red500,
	approved: '#2c82c9',
	draft: '#829394',
};


export default Color;

