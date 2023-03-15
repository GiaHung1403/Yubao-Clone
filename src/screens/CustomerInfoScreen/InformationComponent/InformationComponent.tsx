import React, { useEffect, useState } from 'react';
import { InteractionManager, ScrollView, View } from 'react-native';

import LoadingFullScreen from '@components/LoadingFullScreen';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import { ICustomer } from '@models/types';

interface IProps {
	customerInfo: ICustomer;
}

export default function InformationComponent(props: IProps) {
	const { customerInfo } = props;

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setDoneLoadAnimated(true);
		});
	}, []);

	return doneLoadAnimated ? (
		<ScrollView
			style={{
				flex: 1,
				paddingHorizontal: 8,
				paddingTop: 20,
			}}
			showsVerticalScrollIndicator={false}
		>
			<TextInputCustomComponent
				label="Customer Name"
				placeholder="Customer Name"
				enable={false}
				multiline
				style={{ marginBottom: 12 }}
				value={customerInfo.LS_NM}
			/>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					marginBottom: 12,
				}}
			>
				<TextInputCustomComponent
					label="Lese ID"
					placeholder=""
					enable={false}
					style={{ flex: 1, marginRight: 8 }}
					value={customerInfo.LESE_ID?.toString()}
				/>
				{customerInfo?.TAX_CODE?.trim() ? (
					<TextInputCustomComponent
						label="TaxCode"
						placeholder=""
						enable={false}
						style={{ flex: 1 }}
						value={customerInfo?.TAX_CODE}
					/>
				) : (
					<TextInputCustomComponent
						label="ID No./Passport No"
						placeholder=""
						enable={false}
						style={{ flex: 1 }}
						value={customerInfo?.REG_ID}
					/>
				)}
			</View>

			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					marginBottom: 12,
				}}
			>
				<TextInputCustomComponent
					label="Email"
					placeholder=""
					enable={false}
					style={{ flex: 1, marginRight: 8 }}
					value={customerInfo.EMAIL}
				/>
				<TextInputCustomComponent
					label="Phone Number"
					placeholder=""
					enable={false}
					style={{ flex: 1 }}
					value={customerInfo.TNO}
				/>
			</View>

			<TextInputCustomComponent
				label="Address"
				placeholder=""
				enable={false}
				multiline
				style={{ marginBottom: 12 }}
				value={customerInfo.ADDR}
			/>

			<TextInputCustomComponent
				label="PIC"
				placeholder=""
				enable={false}
				style={{ marginBottom: 12 }}
				value={customerInfo.OP_EMP_NM}
			/>
			<TextInputCustomComponent
				label="Team Leader"
				placeholder=""
				enable={false}
				style={{ marginBottom: 12 }}
				value={customerInfo.TEAM_LEADER}
			/>
			{customerInfo.LOGIN_APP ? (
				<TextInputCustomComponent
					label="Last time login app"
					placeholder=""
					enable={false}
					style={{ marginBottom: 12 }}
					value={customerInfo.LOGIN_APP}
				/>
			) : null}
		</ScrollView>
	) : (
		<LoadingFullScreen />
	);
}
