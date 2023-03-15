import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Dimensions,
	InteractionManager,
	StatusBar,
	View,
} from 'react-native';
import {
	SceneRendererProps,
	TabBar,
	TabView,
} from 'react-native-tab-view';

import { useTheme } from 'react-native-paper';
import Header from '@components/Header';
import { ICustomer } from '@models/types';
import QuotationInfoComponent from './QuotationInfoComponent';
import QuotationResultComponent from './QuotationResultComponent';

interface IRouteParams {
	QUO_ID: string;
	customerSelected: ICustomer;
	quO_RPT: any;
}

const initialLayout = { width: Dimensions.get('window').width };

export function QuotationDetailScreen(props: any) {
	const { QUO_ID, customerSelected, quO_RPT }: IRouteParams =
		props.route.params;

	const { colors } = useTheme();
	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);

	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'info', title: 'Information' },
		{ key: 'result', title: 'Result' },
	]);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);
		});
	}, []);

	const renderScene = ({ route, jumpTo }) => {
		switch (route.key) {
			case 'info':
				return (
					<QuotationInfoComponent
						customerSelected={customerSelected}
						QUO_ID={QUO_ID}
						jumpTo={jumpTo}
						quO_RPT={quO_RPT}
					/>
				);
			case 'result':
				return (
					<QuotationResultComponent
						customerSelected={customerSelected}
						QUO_ID={QUO_ID}
						jumpTo={jumpTo}
					/>
				);
		}
	};

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
				tabStyle={{ width: initialLayout.width / 2 }}
				labelStyle={{ fontWeight: '600', textTransform: undefined }}
				activeColor={colors.primary}
				inactiveColor={'#a1a1aa'}
			/>
		);
	};

	return (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			<View style={{ zIndex: 2 }}>
				<Header title="Quotation Information" />
			</View>

			{doneLoadAnimated ? (
				<TabView
					navigationState={{ index, routes }}
					renderScene={renderScene}
					renderTabBar={renderTabBar}
					onIndexChange={setIndex}
					initialLayout={initialLayout}
					// style={{ marginTop: StatusBar.currentHeight }}
				/>
			) : (
				<View
					style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
				>
					<ActivityIndicator />
				</View>
			)}
		</View>
	);
}
