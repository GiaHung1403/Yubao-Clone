import React, { useState } from 'react';
import { Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface IProps {
	date: Date;
	onConfirm: (date: Date) => void;
	maximumDate?: Date;
	minimumDate?: Date;
	mode?: 'date' | 'time' | 'datetime';
	minuteInterval?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30 | undefined;
}

const DateTimePickerModalCustom = React.forwardRef(
	(props: IProps, ref: any) => {
		const {
			date,
			onConfirm,
			maximumDate,
			minimumDate,
			mode = 'date',
			minuteInterval,
		} = props;
		const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

		React.useImperativeHandle(ref, () => ({
			onShowModal: () => {
				setDatePickerVisibility(true);
			},
		}));

		const _onPressConfirm = (dateConfirm: Date) => {
			setTimeout(() => {
				onConfirm(dateConfirm);
			}, 500);

			setDatePickerVisibility(false);
		};

		return (
			<DateTimePickerModal
				display={
					Platform.OS === 'android'
						? 'default'
						: mode === 'time'
						? 'spinner'
						: 'inline'
				}
				isVisible={isDatePickerVisible}
				mode={mode}
				maximumDate={maximumDate}
				minimumDate={minimumDate}
				date={date}
				onConfirm={_onPressConfirm}
				onCancel={() => setDatePickerVisibility(false)}
				minuteInterval={minuteInterval}
				style={{ paddingBottom: '15%', flex: 0 }}
			/>
		);
	},
);

export default DateTimePickerModalCustom;
