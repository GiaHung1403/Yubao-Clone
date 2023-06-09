import React, { Component } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import WrapMessageItemComponent from './WrapMessageItemComponent';
import {
	PanGestureHandler,
	RotationGestureHandler,
	State,
	FlingGestureHandler,
} from 'react-native-gesture-handler';

const USE_NATIVE_DRIVER = true;

// setInterval(() => {
//   let iters = 1e8, sum = 0;
//   while (iters-- > 0) sum += iters;
// }, 300);

class Snappable extends Component {
	constructor(props) {
		super(props);
		this._dragX = new Animated.Value(0);
		this._transX = this._dragX.interpolate({
			inputRange: [-100, -50, 0, 50, 100],
			outputRange: [-30, -10, 0, 10, 30],
		});
		this._onGestureEvent = Animated.event(
			[{ nativeEvent: { translationX: this._dragX } }],
			{ useNativeDriver: USE_NATIVE_DRIVER },
		);
	}
	_onHandlerStateChange = event => {
		if (event.nativeEvent.oldState === State.ACTIVE) {
			Animated.spring(this._dragX, {
				velocity: event.nativeEvent.velocityX,
				tension: 10,
				friction: 2,
				toValue: 0,
				useNativeDriver: USE_NATIVE_DRIVER,
			}).start();
		}
	};
	render() {
		const { children } = this.props;
		return (
			<PanGestureHandler
				{...this.props}
				maxPointers={1}
				onGestureEvent={this._onGestureEvent}
				onHandlerStateChange={this._onHandlerStateChange}
			>
				<Animated.View style={{ transform: [{ translateX: this._transX }] }}>
					{children}
				</Animated.View>
			</PanGestureHandler>
		);
	}
}

class Twistable extends Component {

	constructor(props) {
		super(props);
		this._gesture = new Animated.Value(0);

		this._rot = this._gesture
			.interpolate({
				inputRange: [-1.2, -1, -0.5, 0, 0.5, 1, 1.2],
				outputRange: [-0.52, -0.5, -0.3, 0, 0.3, 0.5, 0.52],
			})
			.interpolate({
				inputRange: [-100, 100],
				outputRange: ['-100rad', '100rad'],
			});

		this._onGestureEvent = Animated.event(
			[{ nativeEvent: { rotation: this._gesture } }],
			{ useNativeDriver: USE_NATIVE_DRIVER },
		);
	}
	_onHandlerStateChange = event => {
		if (event.nativeEvent.oldState === State.ACTIVE) {
			Animated.spring(this._gesture, {
				velocity: event.nativeEvent.velocity,
				tension: 10,
				friction: 0.2,
				toValue: 0,
				useNativeDriver: USE_NATIVE_DRIVER,
			}).start();
		}
	};
	render() {
		const { children } = this.props;
		return (
			<RotationGestureHandler
				{...this.props}
				onGestureEvent={this._onGestureEvent}
				onHandlerStateChange={this._onHandlerStateChange}
			>
				<Animated.View style={{ transform: [{ rotate: this._rot }] }}>
					{children}
				</Animated.View>
			</RotationGestureHandler>
		);
	}
}

 const  Example = (props : any) => {
		const { item } = props;
		return (
			<View >
				<Snappable>
					<Twistable>
						{item}
					</Twistable>
				</Snappable>
			</View>
		);
 }
export default Example;

const BOX_SIZE = 200;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	box: {
		width: BOX_SIZE,
		height: BOX_SIZE,
		borderColor: '#F5FCFF',
		alignSelf: 'center',
		backgroundColor: 'plum',
		margin: BOX_SIZE / 2,
	},
});
