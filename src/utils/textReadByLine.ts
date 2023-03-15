import { FirebaseMLTypes } from '@react-native-firebase/ml';
import { Image } from 'react-native';

/**
 *
 * @param processed firebase text
 * @param uri local file
 * @returns string
 * this function will read a document line by line
 */
export const Read_Line_Taxi = (processed, ImgWidth) => {


	let allDataLeft = [];
	let allDataRight = [];
	// devide the data into 2 part the left is all the data that samller than the imageWidth/2
	// which usually the key, the right will the val

	processed.forEach(i => {
		let conem = i.lines;

		conem.forEach(imageData => {
			if (imageData.boundingBox[0] < ImgWidth / 2) {
				
				allDataLeft.push({
					box: imageData.boundingBox,
					text: imageData.text,
				});
			} else {
				allDataRight.push({
					box: imageData.boundingBox,
					text: imageData.text,
				});
			}

			// let currentLine = sortedBoxes[0].text;
			// let currentY = sortedBoxes[0].boundingBox[1];
			// let currentHeight = sortedBoxes[0].boundingBox[3];
			// const lines = [currentLine];

			// for (let i = 1; i < sortedBoxes.length; i++) {
			//  const box = sortedBoxes[i];
			//  const y = box.boundingBox[1];
			//  const height = box.boundingBox[3];

			//  if (Math.abs(height - currentHeight) <= 10 && Math.abs(y - currentY) <= currentHeight) {
			//      currentLine += ' ' + box.text;
			//  } else {
			//      currentLine = box.text;
			//      currentY = y;
			//      currentHeight = height;
			//      lines.push(currentLine);
			//  }
			// }

			// return lines;
		});
	});
	// boundingBox is the content box the square we see in AI
	// make of [x,y,width,height] or [x1,y1,x2,y2]=>used with fire base
	// sort base on the y1 height
	allDataLeft = allDataLeft.sort((a, b) => a['box'][1] - b['box'][1]);
	allDataRight = allDataRight.sort((a, b) => a['box'][1] - b['box'][1]);

	/**
	 *
	 * @param boxes L
	 * @param boxes2 R
	 * @returns String
	 * loop throgh the L check the compare the curr y1 with any of the R y1
	 * if the they lied in the 5% margin which indicate same line then return that string
	 *
	 *
	 * CONS: if the image is not straight then data may wrong
	 * Possible improve: scan image before hand or in my case hard modify the gpt prompt
	 *
	 *
	 */

	function groupBoxes(boxes, boxes2) {
		let str = '';
		for (let i = 0; i < boxes.length; i++) {
			str += boxes[i]['text'];
			let curr = 0;
			while (boxes2.length > 0 && curr < boxes2.length) {
				if (
					Math.abs(boxes[i]['box'][1] - boxes2[curr]['box'][1]) /
						boxes[i]['box'][1] <=
					0.05
				) {
					str += ' ' + boxes2[curr]['text'];
					boxes2.splice(curr, 1);
				} else curr += 1;
			}

			str += '\n';
			// groups.push(group);
		}
		return str;
	}
	return groupBoxes(allDataLeft, allDataRight);
};
