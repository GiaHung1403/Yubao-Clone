import { Platform, StyleSheet } from 'react-native';

const codeFontFamily = Platform.select({
	ios: { fontFamily: 'Courier New' },
	android: { fontFamily: 'monospace' }
});

export default StyleSheet.create<any>({
	container: {
		alignItems: 'flex-start',
		flexDirection: 'row'
	},
	childContainer: {
		flex: 1
	},
	block: {
		alignItems: 'flex-start',
		flexDirection: 'row',
		flexWrap: 'wrap',
		flex: 1
	},
	emph: {
		fontStyle: 'italic'
	},
	strong: {
		fontWeight: 'bold'
	},
	del: {
		textDecorationLine: 'line-through'
	},
	plainText: {
		flexShrink: 1,
	},
	text: {
		textAlign: 'left',
		backgroundColor: 'transparent',
		...Platform.select({
			ios: {
				fontFamily: 'System',
				fontWeight: '400'
			},
			android: {
				includeFontPadding: false,
				fontFamily: 'sans-serif',
				fontWeight: 'normal'
			}
		})
	},
	textInfo: {
		fontStyle: 'italic',
		textAlign: 'left',
		backgroundColor: 'transparent',
		...Platform.select({
			ios: {
				fontFamily: 'System',
				fontWeight: '400'
			},
			android: {
				includeFontPadding: false,
				fontFamily: 'sans-serif',
				fontWeight: 'normal'
			}
		})
	},
	textBig: {
		fontSize: 30,
		textAlign: 'left',
		backgroundColor: 'transparent',
		...Platform.select({
			ios: {
				fontFamily: 'System',
				fontWeight: '400'
			},
			android: {
				includeFontPadding: false,
				fontFamily: 'sans-serif',
				fontWeight: 'normal'
			}
		})
	},
	customEmoji: {
		width: 20,
		height: 20
	},
	customEmojiBig: {
		width: 120,
		height: 120
	},
	temp: { opacity: 0.3 },
	mention: {
		textAlign: 'left',
		backgroundColor: 'transparent',
		...Platform.select({
			ios: {
				fontFamily: 'System',
				fontWeight: '600'
			},
			android: {
				includeFontPadding: false,
				fontFamily: 'sans-serif',
				fontWeight: 'bold'
			}
		})
	},
	paragraph: {
		marginTop: 0,
		marginBottom: 0,
		flexWrap: 'wrap',
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'flex-start'
	},
	inlineImage: {
		width: 300,
		height: 300,
		resizeMode: 'contain'
	},
	codeInline: {
		textAlign: 'left',
		backgroundColor: 'transparent',
		...Platform.select({
			ios: {
				fontFamily: 'System',
				fontWeight: '400'
			},
			android: {
				includeFontPadding: false,
				fontFamily: 'sans-serif',
				fontWeight: 'normal'
			}
		}),
		...codeFontFamily,
		borderWidth: 1,
		borderRadius: 4,
		paddingLeft: 2,
		paddingTop: 2
	},
	codeBlock: {
		textAlign: 'left',
		backgroundColor: 'transparent',
		...Platform.select({
			ios: {
				fontFamily: 'System',
				fontWeight: '400'
			},
			android: {
				includeFontPadding: false,
				fontFamily: 'sans-serif',
				fontWeight: 'normal'
			}
		}),
		...codeFontFamily,
		borderWidth: 1,
		borderRadius: 4,
		padding: 4
	},
	link: {
		textAlign: 'left',
		backgroundColor: 'transparent',
		...Platform.select({
			ios: {
				fontFamily: 'System',
				fontWeight: '400'
			},
			android: {
				includeFontPadding: false,
				fontFamily: 'sans-serif',
				fontWeight: 'normal'
			}
		})
	},
	edited: {
		fontSize: 14,
		textAlign: 'left',
		backgroundColor: 'transparent',
		...Platform.select({
			ios: {
				fontFamily: 'System',
				fontWeight: '400'
			},
			android: {
				includeFontPadding: false,
				fontFamily: 'sans-serif',
				fontWeight: 'normal'
			}
		})
	},
	heading1: {
		textAlign: 'left',
		backgroundColor: 'transparent',
		...Platform.select({
			ios: {
				fontFamily: 'System',
				fontWeight: '700'
			},
			android: {
				includeFontPadding: false,
				fontFamily: 'sans-serif',
				fontWeight: 'bold'
			}
		}),
		fontSize: 24
	},
	heading2: {
		textAlign: 'left',
		backgroundColor: 'transparent',
		...Platform.select({
			ios: {
				fontFamily: 'System',
				fontWeight: '700'
			},
			android: {
				includeFontPadding: false,
				fontFamily: 'sans-serif',
				fontWeight: 'bold'
			}
		}),
		fontSize: 22
	},
	heading3: {
		textAlign: 'left',
		backgroundColor: 'transparent',
		...Platform.select({
			ios: {
				fontFamily: 'System',
				fontWeight: '600'
			},
			android: {
				includeFontPadding: false,
				fontFamily: 'sans-serif',
				fontWeight: 'bold'
			}
		}),
		fontSize: 20
	},
	heading4: {
		textAlign: 'left',
		backgroundColor: 'transparent',
		...Platform.select({
			ios: {
				fontFamily: 'System',
				fontWeight: '600'
			},
			android: {
				includeFontPadding: false,
				fontFamily: 'sans-serif',
				fontWeight: 'bold'
			}
		}),
		fontSize: 18
	},
	heading5: {
		textAlign: 'left',
		backgroundColor: 'transparent',
		...Platform.select({
			ios: {
				fontFamily: 'System',
				fontWeight: '500'
			},
			android: {
				includeFontPadding: false,
				fontFamily: 'sans-serif-medium',
				fontWeight: 'normal'
			}
		}),
	},
	heading6: {
		textAlign: 'left',
		backgroundColor: 'transparent',
		...Platform.select({
			ios: {
				fontFamily: 'System',
				fontWeight: '500'
			},
			android: {
				includeFontPadding: false,
				fontFamily: 'sans-serif-medium',
				fontWeight: 'normal'
			}
		}),
		fontSize: 14
	},
	quote: {
		height: '100%',
		width: 2,
		marginRight: 5
	},
	touchableTable: {
		justifyContent: 'center'
	},
	containerTable: {
		borderBottomWidth: 1,
		borderRightWidth: 1
	},
	table: {
		borderLeftWidth: 1,
		borderTopWidth: 1
	},
	tableExtraBorders: {
		borderBottomWidth: 1,
		borderRightWidth: 1
	},
	row: {
		flexDirection: 'row'
	},
	rowBottomBorder: {
		borderBottomWidth: 1
	},
	cell: {
		justifyContent: 'flex-start',
		paddingHorizontal: 13,
		paddingVertical: 6
	},
	cellRightBorder: {
		borderRightWidth: 1
	},
	alignCenter: {
		textAlign: 'center'
	},
	alignRight: {
		textAlign: 'right'
	},
	inline: {
		flexShrink: 1
	}
});
