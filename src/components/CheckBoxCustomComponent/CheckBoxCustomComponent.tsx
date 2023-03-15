import { Icon } from 'native-base';
import React, { useRef, useState } from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import Color from '@config/Color';
import { AntDesign } from '@expo/vector-icons';
import DateTimePickerModalCustom from '../DateTimePickerModalCustom';
import styles from './styles';

import { useTheme } from 'react-native-paper';
import RadioForm, {
	RadioButton,
	RadioButtonInput,
	RadioButtonLabel,
} from 'react-native-simple-radio-button';
import { justifyContent } from 'styled-system';

interface IProps {
	listData: any[];
	title ?: string;
	value: any;
	setValue: any;
	showTitle: boolean;
}

export default function CheckBoxCustomComponent(props: IProps) {
	const { colors } = useTheme();
	const { listData, title, value, setValue, showTitle } = props;
	return (
		<>
			<View style={{ flex: 1 }}>
				{showTitle ? (
					<Text style={{ fontWeight: '500', color: '#555' }}>{title}</Text>
				) : null}

				<RadioForm formHorizontal={true} animation={true}>
					{listData.map((obj, index) => (
						<RadioButton
							labelHorizontal={true}
							key={index}
							// style={{ paddingHorizontal : index === 1 ? 25 : 0 }}
						>
							<RadioButtonInput
								obj={obj}
								index={index}
								isSelected={value === obj?.value}
								onPress={() => setValue(obj?.value)}
								borderWidth={1}
								buttonInnerColor={colors.primary}
								buttonOuterColor={value === obj.value ? '#2196f3' : '#5a5a5a'}
								buttonSize={14}
								buttonOuterSize={20}
								buttonWrapStyle={{ paddingVertical: 12 }}
							/>
							<RadioButtonLabel
								obj={obj}
								index={index}
								labelHorizontal={true}
								onPress={() => setValue(obj.value)}
								labelStyle={{
									color: value === obj.value ? colors.primary : '#5a5a5a',
									fontWeight: '500',
									marginLeft: -4,
									marginRight: 20,
								}}
							/>
						</RadioButton>
					))}
				</RadioForm>
			</View>
		</>
	);
}
