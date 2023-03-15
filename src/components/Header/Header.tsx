import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
    Image,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {Button,useTheme} from 'react-native-paper';

import {rem} from '@utils';
import styles from './styles';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Color from "@config/Color";
import { Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

const IC_BACK = require('@assets/icons/ic_back.png');

interface IProps {
	style?: any;
	title?: any;
	hiddenBack?: any;
	backgroundColor?: any;
	color?: any;
	isShowButton?: any;
	onPressButton?: any;
	onPressButtonBack?: any;
	labelButton?: any;
	disabled?: any;
	isShowButtonImage ?: boolean;
	buttonImageName ? : any;
}

export default function HeaderBack(props: IProps) {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const {
			style,
			title,
			hiddenBack,
			backgroundColor,
			color,
			isShowButton,
			onPressButton,
			labelButton,
			onPressButtonBack,
			disabled,
			isShowButtonImage,
			buttonImageName,
		} = props;

    const _onPressButtonBack = () => {
        navigation.goBack();
    };

    return (
			<SafeAreaView
				style={[
					styles.containerBackgroundBack,
					styles.cardHeader,
					{ backgroundColor: backgroundColor || colors.primary },
				]}
			>
				<View style={[styles.containerBack, style]}>
					<TouchableOpacity
						onPress={onPressButtonBack || _onPressButtonBack}
						style={styles.buttonBack}
						disabled={hiddenBack}
					>
						{hiddenBack ? null : (
							<Image
								source={IC_BACK}
								resizeMode="contain"
								style={[styles.iconButtonBack, { tintColor: color || '#fff' }]}
							/>
						)}
					</TouchableOpacity>
					<Text
						style={{
							color: color || '#fff',
							fontWeight: 'bold',
							fontSize: 15,
							textAlign: 'center',
							marginHorizontal: 20,
							// paddingRight: isShowButton ? 50 : 0,
							paddingRight: 0,
						}}
						numberOfLines={1}
					>
						{title}
					</Text>
					{isShowButton && (
						<Button
							mode="outlined"
							style={{
								borderColor: '#fff',
								position: 'absolute',
								right: 8,
								zIndex: 10,
							}}
							disabled={disabled}
							labelStyle={{ color: '#fff', fontSize: 12 }}
							uppercase={false}
							onPress={() => onPressButton()}
						>
							{labelButton}
						</Button>
					)}
					{isShowButtonImage && (
						<TouchableOpacity
							style={{ padding: 8, position: 'absolute', right: 8, zIndex: 10 }}
							onPress={() => onPressButton()}
							disabled={disabled}
						>
							<Icon
								as={Ionicons}
								name={buttonImageName}
								size={7}
								color={'#fff'}
							/>
						</TouchableOpacity>
					)}
				</View>
			</SafeAreaView>
		);
}
