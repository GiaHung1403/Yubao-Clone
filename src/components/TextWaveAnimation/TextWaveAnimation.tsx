import React, { useRef, useEffect } from 'react';
import { Text, Animated, ImageBackground, StyleSheet } from 'react-native';

interface Animation {
	text: string;
	Uri: string;
	style?: any;
}
/**
 * a componet to create a wave like text still testing
 * @param props :Animaiton
 * @returns
 */
const TextWaveAnimation = (props: Animation) => {
	const animationValues = useRef([]).current;

	useEffect(() => {
		animationValues.forEach((animationValue, index) => {
			Animated.loop(
				Animated.timing(animationValue, {
					toValue: 1,
					duration: 1000 + index * 100,
					useNativeDriver: true,
				}),
			).start();
		});
	}, []);

	const renderAnimatedText = text => {
		const chars = text.split('');
		return chars.map((char, index) => {
			animationValues[index] = animationValues[index] || new Animated.Value(0);

			const translateY = animationValues[index].interpolate({
				inputRange: [0, 1],
				outputRange: [0, 10 * Math.sin(index * Math.PI)],
			});

			return (
				<Animated.Text key={index} style={{ transform: [{ translateY }] }}>
					{char}
				</Animated.Text>
			);
		});
	};

	return (
		<ImageBackground
			source={{ uri: props.Uri }}
			style={StyleSheet.absoluteFillObject}
		>
			{renderAnimatedText('Text Wave Animation')}
		</ImageBackground>
	);
};

export default TextWaveAnimation;
