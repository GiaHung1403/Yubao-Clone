import React from 'react';
import { Circle, G, Line, Text } from 'react-native-svg';

export default function LabelPieChart(props: any) {
  const { slices } = props;
  return slices.map((slice, index) => {
    const { labelCentroid, pieCentroid, data } = slice;
    return (
      <G key={index}>
        {/* <Line
          x1={labelCentroid[0]}
          y1={labelCentroid[1]}
          x2={pieCentroid[0]}
          y2={pieCentroid[1]}
          stroke={data.svg.fill}
        /> */}

        {/* <Circle
          cx={labelCentroid[0]}
          cy={labelCentroid[1]}
          r={15}
          fill={data.svg.fill}
        /> */}

        {data.amount > 0 && (
          <Text
            key={index}
            x={pieCentroid[0]}
            y={pieCentroid[1]}
            fill={'#3e3e3e'}
            textAnchor={'middle'}
            alignmentBaseline={'middle'}
            fontSize={14}
            stroke={'#3e3e3e'}
            strokeWidth={0.2}
          >
            {`${data.amount}%`}
          </Text>
        )}
        {/*
        <Text
          key={index}
          x={labelCentroid[0]}
          y={labelCentroid[1]}
          fill={"black"}
          textAnchor={"middle"}
          alignmentBaseline={"middle"}
          fontSize={14}
          stroke={"black"}
          strokeWidth={0.2}
        >
          {`B200324613`}
        </Text> */}
      </G>
    );
  });
}
