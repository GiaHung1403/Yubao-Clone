import React, { useEffect, useState } from 'react';
import { Dimensions, StatusBar, View } from 'react-native';
import {
	SceneMap,
	SceneRendererProps,
	TabBar,
	TabView,
} from 'react-native-tab-view';

import Header from '@components/Header';
import { ICustomer, IUserSystem } from '@models/types';
import { useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import CAListComponent from './CAListComponent';
import CFListComponent from './CFListComponent';
import CIC_CheckingComponent from './CIC_CheckingComponent/CIC_CheckingComponent';
import ContactPersonComponent from './ContactPersonComponent';
import ContractListComponent from './ContractListComponent';
import EDocComponent from './EDocComponent';
import InformationComponent from './InformationComponent';
import ListTeleHistoryComponent from './ListTeleHistoryComponent';
import ListTeleHistoryComponent_T from './ListTeleHistoryComponent_T';
import ListVisitHistoryComponent from './ListVisitHistoryComponent';
import ListVisitHistoryComponent_T from './ListVisitHistoryComponent_T';
import PaymentNoticeComponent from './PaymentNoticeComponent';
interface IRouteParams {
	customerInfo: ICustomer;
}

const initialLayout = { width: Dimensions.get('window').width };

export function CustomerInfoScreen(props: any) {
	let index = 0;
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const { customerInfo }: IRouteParams = props.route.params;
	const { colors } = useTheme();
	// const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'first', title: 'Information' },
		{ key: 'second', title: 'Payment Notice' },
		{ key: 'third', title: 'CIC' },
		{ key: 'fourth', title: 'Visit' },
		{ key: 'five', title: 'Tele' },
		{ key: 'six', title: 'CF' },
		{ key: 'seven', title: 'CA' },
		{ key: 'eight', title: 'Contract' },
		{ key: 'nine', title: 'Contact Person' },
		{ key: 'ten', title: 'Other E-Doc' },
	]);

	const FirstRoute = () => <InformationComponent customerInfo={customerInfo} />;
	const SecondRoute = () => (
		<PaymentNoticeComponent
			taxCode={customerInfo?.TAX_CODE?.trim() || customerInfo?.REG_ID?.trim()}
		/>
	);
	const ThirdRoute = () => (
		<CIC_CheckingComponent
			leseID={customerInfo.LESE_ID}
			customerName={customerInfo.LS_NM}
		/>
	);
	const FourthRoute = () =>
		dataUserSystem.EMP_NO.includes('T') ? (
			<ListVisitHistoryComponent_T leseID={customerInfo.LESE_ID} />
		) : (
			<ListVisitHistoryComponent leseID={customerInfo.LESE_ID} />
		);
	const FiveRoute = () =>
		dataUserSystem.EMP_NO.includes('T') ? (
			<ListTeleHistoryComponent_T customerName={customerInfo.LS_NM} />
		) : (
			<ListTeleHistoryComponent customerName={customerInfo.LS_NM} />
		);
	const SixRoute = () => <CFListComponent leseID={customerInfo.LESE_ID} />;
	const SevenRoute = () => <CAListComponent leseID={customerInfo.LESE_ID} />;
	const EightRoute = () => (
		<ContractListComponent
			taxCode={customerInfo?.TAX_CODE?.trim() || customerInfo?.REG_ID?.trim()}
		/>
	);
	const NineRoute = () => (
		<ContactPersonComponent
			leseID={customerInfo.LESE_ID}
			hasContact={customerInfo.CONTACT_PERSON > 0}
		/>
	);
	const TenRoute = () => (
		<EDocComponent taxCode={customerInfo?.TAX_CODE?.trim() || customerInfo?.REG_ID?.trim()} />
	);

	const renderScene = SceneMap({
		first: FirstRoute,
		second: SecondRoute,
		third: ThirdRoute,
		fourth: FourthRoute,
		five: FiveRoute,
		six: SixRoute,
		seven: SevenRoute,
		eight: EightRoute,
		nine: NineRoute,
		ten: TenRoute,
	});

	const renderTabBar = (
		propsData: SceneRendererProps & { navigationState },
	) => {
		return (
			<TabBar
				{...propsData}
				scrollEnabled
				indicatorStyle={{
					borderBottomColor: colors.primary,
					borderBottomWidth: 4,
				}}
				style={{ backgroundColor: '#fff' }}
				tabStyle={{ width: 120 }}
				labelStyle={{
					fontWeight: '600',
					textTransform: undefined,
					textAlign: 'center',
				}}
				activeColor={colors.primary}
				inactiveColor={'#a1a1aa'}
			/>
		);
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title="Customer Information" />
			</View>

			<View style={{ flex: 1 }}>
				<TabView
					navigationState={{ index, routes }}
					renderScene={renderScene}
					renderTabBar={renderTabBar}
					onIndexChange={value => {
						index = value;
					}}
					initialLayout={initialLayout}
					// style={{ marginTop: StatusBar.currentHeight }}
				/>
			</View>
		</View>
	);
}
