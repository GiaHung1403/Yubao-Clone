import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';

const IC_SAD_RELIEVED = require('@assets/icons/ic_sad_relieved.png');
const IC_SAD_RELIEVED_UNSELECTED = require('@assets/icons/ic_sad_relieved_unselected.png');
const IC_EXPRESSIONLESS_FACE = require('@assets/icons/ic_expressionless_face.png');
const IC_EXPRESSIONLESS_FACE_UNSELECTED = require('@assets/icons/ic_expressionless_face_unselected.png');
const IC_NEUTRAL_FACE = require('@assets/icons/ic_neutral_face.png');
const IC_NEUTRAL_FACE_UNSELECTED = require('@assets/icons/ic_neutral_face_unselected.png');
const IC_SLIGHTLY_SMILING_FACE = require('@assets/icons/ic_slightly_smiling_face.png');
const IC_SLIGHTLY_SMILING_FACE_UNSELECTED = require('@assets/icons/ic_slightly_smiling_face_unselected.png');
const IC_FACE_BLOWING_KISS = require('@assets/icons/ic_face_blowing_kiss.png');
const IC_FACE_BLOWING_KISS_UNSELECTED = require('@assets/icons/ic_face_blowing_kiss_unselected.png');

interface IProps {
  ratingReview: number;
  onPressRating: (numberRating: number) => void
}

const getIconRating = (ratingReview) => {
  switch (ratingReview) {
    case 1:
      return IC_SAD_RELIEVED;
    case 2:
      return IC_EXPRESSIONLESS_FACE;
    case 3:
      return IC_NEUTRAL_FACE;
    case 4:
      return IC_SLIGHTLY_SMILING_FACE;
    case 5:
      return IC_FACE_BLOWING_KISS;
    default:
      return IC_SAD_RELIEVED;
  }
};

const getIconRatingUnSelected = (ratingReview) => {
  switch (ratingReview) {
    case 1:
      return IC_SAD_RELIEVED_UNSELECTED;
    case 2:
      return IC_EXPRESSIONLESS_FACE_UNSELECTED;
    case 3:
      return IC_NEUTRAL_FACE_UNSELECTED;
    case 4:
      return IC_SLIGHTLY_SMILING_FACE_UNSELECTED;
    case 5:
      return IC_FACE_BLOWING_KISS_UNSELECTED;
    default:
      return IC_SAD_RELIEVED_UNSELECTED;
  }
};

export default function RatingReview(props: IProps) {
  const { ratingReview, onPressRating } = props;

  return (
    <View style={{ flexDirection: 'row' }}>
      {Array.from(
        Array(5).keys(),
      ).map((item, index) => (
        <TouchableOpacity
          key={index.toString()}
          style={{
            paddingHorizontal: 8,
          }}
          onPress={() => onPressRating(index + 1)}>
          <Image
            source={index >= ratingReview ? getIconRatingUnSelected(ratingReview) : getIconRating(ratingReview)}
            resizeMode={'contain'}
            style={{ width: 30, height: 30 }}/>
        </TouchableOpacity>
      ))}
    </View>
  );
}
