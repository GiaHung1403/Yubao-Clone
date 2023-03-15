import { PreferencesContext } from '@context/PreferencesContext';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
	Animated,
	Easing,
	StyleSheet,
	Text,
	TextStyle,
	View,
	ViewStyle,
} from 'react-native';
import Modal, { ModalProps } from 'react-native-modal';
import { useTheme } from 'react-native-paper';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '../../data/local/AsyncStorage';

let check = 0;
const heightProgressbar = 3;
const colorBg = '#808080';
const colorProcess = '#35c48c';
const backgroundColorModal = '#FFF';
// let backdropColor = 'rgba(0,87,146,0.38)';
const colorSubText = '#8492A6';

interface ModalProcessProps {
	wrapProcess?: ViewStyle;
	onBackdropPress?: () => void;
	subTitleStyle?: TextStyle;
	styleTitle?: TextStyle;
	styleModal?: ViewStyle;
	hiddenModal?: () => void;
	isVisible?: boolean;
	setVisible?: (isShowModal: boolean) => void;
	percent: number;
	heightProgressbar?: number;
	colorBg?: string;
	colorProcess?: string;
	backgroundColorModal?: string;
	backdropColor?: string;
	title: string;
	subTitle?: string;
	propsModal?: ModalProps;
	styleWrapContentModal?: ViewStyle;
}

const ModalProgressComponent = (props: ModalProcessProps, ref: any) => {
	const widthAmin = useRef(new Animated.Value(0)).current;
	const opacityAmin = useRef(new Animated.Value(0)).current;
	const [isShowModal, setShowModal] = useState<boolean>(false);
	const { colors } = useTheme();

	const colorsTheme = React.useContext(PreferencesContext);
	useImperativeHandle(ref, () => ({
		showModal: async item => {
			setShowModal(item);
			if (colors.primary === '#FF0000') {
				const sysTheme: any = {
					color: '#9b59b6',
					theme: 1,
					header: 2,
				};
				colorsTheme.toggleTheme(sysTheme);
				await AsyncStorage.setColor(sysTheme);
			}
		},
	}));

	const onStartWidthAnimation = () => {
		Animated.timing(widthAmin, {
			useNativeDriver: false,
			toValue: props.percent,
			duration: 300,
			easing: Easing.linear,
		}).start();
	};

	useEffect(() => {
		if (
			(props.percent > 0 && check === 0) ||
			(props.percent <= 0 && check === 1)
		) {
			check = props.percent > 0 && check === 0 ? 1 : 0;
			Animated.sequence([
				Animated.timing(opacityAmin, {
					useNativeDriver: false,
					toValue: heightProgressbar,
					duration: 600,
					easing: Easing.bounce,
				}),
				Animated.timing(widthAmin, {
					useNativeDriver: false,
					toValue: props.percent,
					duration: 300,
					easing: Easing.linear,
				}),
			]).start();
			console.log(props.percent);
		} else onStartWidthAnimation();
	}, [props.percent]);

	const widthAni = widthAmin.interpolate({
		inputRange: [0, 100],
		outputRange: ['0%', '100%'],
	});

	return (
		<Modal
			animationIn="zoomInDown"
			animationOut="zoomOutUp"
			backdropOpacity={1}
			backdropColor={props.backdropColor}
			isVisible={isShowModal}
			style={[styles.modal, props.styleModal]}
			onModalHide={props.hiddenModal}
			onBackdropPress={
				props.onBackdropPress ? props.onBackdropPress : props.hiddenModal
			}
			{...props.propsModal}
		>
			<View
				style={[
					styles.wrapModal,
					props.styleWrapContentModal,
					{ backgroundColor: props.backgroundColorModal },
				]}
			>
				<Text style={[styles.title, props.styleTitle]}>{props.title}</Text>
				{props.subTitle && (
					<Text style={[styles.subTitleStyle, props.subTitleStyle]}>
						{props.subTitle}
					</Text>
				)}
				<Animated.View
					style={[
						styles.wrapProcess,
						props.wrapProcess,
						{ height: opacityAmin },
					]}
				>
					<Animated.View
						style={[
							styles.process,
							{ width: widthAni, backgroundColor: colors.primary },
						]}
					/>
					{/* <Text style={styles.txtPercent}>{props.percent}%</Text> */}
				</Animated.View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	title: {
		textAlign: 'center',
		fontWeight: '500',
		fontSize: 17,
		marginBottom: 7,
	},
	wrapModal: {
		// backgroundColor: backgroundColorModal,
		// backgroundColor: 'rgba(0,0,0,0.5)',
		borderRadius: 12,
		padding: 14,
		justifyContent: 'center',
		paddingVertical: 35,
	},
	wrapProcess: {
		backgroundColor: colorBg,
		height: 0,
		width: '100%',
		position: 'relative',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 12,
		marginTop: 30,
		borderRadius: 4,
	},
	process: {
		height: heightProgressbar,
		position: 'absolute',
		left: 0,
		borderRadius: 4,
	},
	txtPercent: {
		color: Colors.white,
		fontWeight: 'bold',
	},
	btn: {
		backgroundColor: 'brown',
		justifyContent: 'center',
		paddingVertical: 12,
		alignItems: 'center',
		width: '60%',
		alignSelf: 'center',
		marginVertical: 20,
		borderRadius: 11,
	},
	txtWhite: {
		color: 'white',
		fontWeight: 'bold',
	},
	fadingContainer: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		backgroundColor: 'powderblue',
	},
	fadingText: {
		fontSize: 28,
		textAlign: 'center',
		margin: 10,
	},
	modal: {
		flex: 1,
		margin: 14,
	},
	subTitleStyle: {
		textAlign: 'center',
		color: colorSubText,
	},
});

export default React.forwardRef(ModalProgressComponent);
