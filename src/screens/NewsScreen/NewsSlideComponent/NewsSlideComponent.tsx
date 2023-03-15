import React from 'react';
import { Image, Text, View } from 'react-native';
import { Card } from 'react-native-paper';

import styles from './styles';

const LOGO = require('../../../assets/logo.png');

interface IProps {
  news: any;
  onPress: () => void;
}

const removeHTMLTag = text => {
  return text.replace(/(<([^>]+)>)/gi, "").trim();
};


export default function NewsSlideComponent(props: IProps) {
  const { news, onPress } = props;

  return (
    <Card elevation={2} style={styles.containerCard} onPress={onPress}>
      <Image
        source={{
          uri: news.imageUrl,
        }}
        resizeMode="cover"
        style={styles.containerImage}
      />
      <View style={styles.containerContent}>
        <Text style={styles.title}>{news.title}</Text>
        <Text style={styles.content} numberOfLines={3}>
          {removeHTMLTag(news.desc)}
        </Text>

        <View style={styles.containerLogo}>
          <Image source={LOGO} resizeMode="contain" style={styles.logo} />
          <Text style={styles.createAt}>Chailease - {news.date}</Text>
        </View>
      </View>
    </Card>
  );
}
