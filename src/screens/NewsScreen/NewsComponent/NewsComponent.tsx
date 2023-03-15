import React from "react";
import { Image, Text, View } from "react-native";
import { Card } from "react-native-paper";
import styles from "./styles";
// import HTMLView from "react-native-htmlview";

const LOGO = require("../../../assets/logo.png");

interface INews {
  id: number;
  date: string;
  author: string;
  cat_id: number;
  cat_name: string;
  focus: number;
  title: string;
  desc: string;
  content: string;
  url: string;
  imageUrl: string;
}

interface IProps {
  news: INews;
  onPress: () => void;
}

const removeHTMLTag = text => {
  return text.replace(/(<([^>]+)>)/gi, "").trim();
};

export default function NewsComponent(props: IProps) {
  const { news, onPress } = props;


  return (
    <Card elevation={2} style={styles.containerCard} onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.containerContent}>
          <Text style={styles.textTitle}>{news.title}</Text>
          {/* <HTMLView value={news.desc} stylesheet={styles} /> */}
          <Text numberOfLines={2} style={styles.textContent}>
            {removeHTMLTag(news.desc)}
          </Text>

          <View style={styles.containerLogo}>
            <Image source={LOGO} resizeMode="contain" style={styles.logo} />
            <Text style={styles.labelLogo}>Chailease - {news.date}</Text>
          </View>
        </View>

        <Image
          source={{
            uri: news.imageUrl,
          }}
          resizeMode="cover"
          style={styles.imageCover}
        />
      </View>
    </Card>
  );
}
