import React, { useImperativeHandle, useState } from 'react';
import { Keyboard, Text, View } from 'react-native';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';

interface IProps {
  onEmojiSelected: any;
}

const EmojiComponent = React.forwardRef((props: IProps, ref: any) => {
  const { onEmojiSelected } = props;
  const [isShowViewEmoji, setShowViewEmoji] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    onToggle: () => {
      Keyboard.dismiss();
      setShowViewEmoji((isShow) => !isShow);
    },
  }));

  return (
    <View style={{ height: isShowViewEmoji ? 240 : 0 }}>
      <EmojiSelector
        category={Categories.emotion}
        onEmojiSelected={(emoji) => onEmojiSelected(emoji)}
        showTabs={false}
        showSearchBar={false}
        showSectionTitles={false}
        columns={10}
      />
    </View>
  );
});

export default EmojiComponent;
