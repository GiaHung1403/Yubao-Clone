import openLink from '@utils/openLink';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Linking, Image ,ScrollView } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ImageViewerCustom from '@components/ImageViewerCustom';


// you might want to compile these two as standalone umd bundles
// using `browserify --standalone` and `derequire`
// until this issue is fixed: https://github.com/facebook/react-native/issues/231
// and then just require the umd bundle files directly
var htmlparser = require('htmlparser2');
var entities = require('entities');

function htmlToElement(rawHtml, stylesheet, _onPressImage, done) {
	var handler = new htmlparser.DomHandler(function (err, dom) {
		if (err) done(err);
		done(null, domToElement(dom, stylesheet, _onPressImage, null));
	});
	var parser = new htmlparser.Parser(handler);
	parser.write(rawHtml);
	parser.done();
}

var PARAGRAPH_BREAK = '\n\n';

function domToElement(dom, stylesheet, _onPressImage, parent) {
	if (!dom) return null;


	return dom.map((node: any, index, list) => {
					if (node.type == 'text') {
						return (
							<Text
								key={index}
								style={
									parent
										? stylesheet
											? stylesheet[parent.name]
											: styles[parent.name]
										: null
								}
							>
								{entities.decodeHTML(node.data)}
							</Text>
						);
					}
					if (node.type == 'tag') {
						let touchHandler: () => any = () => null;
						if (node.name == 'a' && node.attribs && node.attribs.href) {
							touchHandler = () =>
								openLink(entities.decodeHTML(node.attribs.href));
						}

						if (node.name === 'img') {
							return (
								<TouchableWithoutFeedback
									style={{ width: '100%' }}
									onPress={() => _onPressImage(node.attribs.src)}
								>
									<Image
										source={{ uri: node.attribs.src }}
										style={{ width: 300, height: 100 }}
									/>
								</TouchableWithoutFeedback>
							);
						}

						return (
							<Text key={index}>
								{domToElement(node.children, stylesheet, _onPressImage, node)}
								{node.name == 'p' && index < list.length - 1
									? PARAGRAPH_BREAK
									: null}
							</Text>
						);
					}
				})
}

const boldStyle: any = { fontWeight: '500' };
const italicStyle: any = { fontStyle: 'italic' };
const codeStyle: any = { fontFamily: 'Menlo' };

const styles = StyleSheet.create({
	b: boldStyle,
	strong: boldStyle,
	i: italicStyle,
	em: italicStyle,
	pre: codeStyle,
	code: codeStyle,
	a: {
		fontWeight: '500',
		color: '#007AFF',
	},
});

export default function HTML(props) {
	const imageViewerRef = useRef<any>();
	const { value, stylesheet } = props;
	let renderingHtml;

	const [element, setElement] = useState();

	useEffect(() => {
		if (element) return;
		startHtmlRender();
	}, [value]);

	const startHtmlRender = () => {
		if (!value) return;
		if (renderingHtml) return;

		renderingHtml = true;
		htmlToElement(value, stylesheet, _onPressImage, (err, element) => {
			renderingHtml = false;

			if (err) return console.error(err);

			setElement(element);
		});
	};

	const _onPressImage = url => {
		imageViewerRef.current.onShowViewer([{ url }]);
	};

	if (element) {
		return (
			<View style={{ flex: 1 }}>
				<Text children={element} />

				<ImageViewerCustom
					ref={ref => {
						imageViewerRef.current = ref;
					}}
				/>
			</View>
		);
	}

	return <Text />;
}
