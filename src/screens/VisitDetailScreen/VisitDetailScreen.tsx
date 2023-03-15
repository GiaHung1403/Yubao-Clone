import Header from '@components/Header';
import { IVisit } from '@models/types';
import React, { useEffect, useState } from 'react';
import { Dimensions, StatusBar, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SceneRendererProps, TabBar, TabView } from 'react-native-tab-view';
import VisitHistoryComponent from './VisitHistoryComponent';
import VisitInfoComponent from './VisitInfoComponent';

interface IRouteParams {
	visitInfo: IVisit;
	customerSelected: any;
}

const initialLayout = { width: Dimensions.get('window').width };

export function VisitDetailScreen(props: any) {
	const { visitInfo, customerSelected }: IRouteParams = props.route.params;

	const { colors } = useTheme();
	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'info', title: 'Visit Info' },
		{ key: 'history', title: 'Visit History' },
	]);
	console.log(visitInfo);

	const renderScene = ({ route }) => {
		switch (route.key) {
			case 'info':
				return (
					<VisitInfoComponent
						visitInfo={visitInfo}
						customerSelected={customerSelected}
					/>
				);
			case 'history':
				return <VisitHistoryComponent LeseID={visitInfo.lese_ID} />;
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
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title="Visiting" />
			</View>

			{visitInfo ? (
				<TabView
					navigationState={{ index, routes }}
					renderScene={renderScene}
					renderTabBar={renderTabBar}
					onIndexChange={setIndex}
					initialLayout={initialLayout}
					// style={{ marginTop: StatusBar.currentHeight }}
				/>
			) : (
				<VisitInfoComponent
					visitInfo={visitInfo}
					customerSelected={customerSelected}
				/>
			)}
		</View>
	);
}
