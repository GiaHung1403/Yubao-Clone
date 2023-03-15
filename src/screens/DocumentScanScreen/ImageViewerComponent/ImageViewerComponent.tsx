import React, { useImperativeHandle, useState } from 'react';
import FastImage from 'react-native-fast-image';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';

function ImageViewerComponent(props: any, ref: any) {
  const [visible, setVisible] = useState<boolean>(false);
  const [imageViewer, setImageViewer] = useState<any>();

  useImperativeHandle(ref, () => ({
    onShowViewer: (imageURL) => {
      setVisible(true);
      setImageViewer([
        {
          // Simplest usage.
          url: imageURL,

          // width: number
          // height: number
          // Optional, if you know the image size, you can set the optimization performance

          // You can pass props to <Image />.
          props: {
            // headers: ...
          },
        },
      ]);
    },
  }));

  return (
    <Modal
      isVisible={visible}
      style={{ margin: 0 }}
    >
      <ImageViewer
        imageUrls={imageViewer}
        backgroundColor="transparent"
        enableSwipeDown
        onSwipeDown={() => setVisible(false)}
        renderImage={(propsImage) => <FastImage {...propsImage} />}
        swipeDownThreshold={0.3}
      />
    </Modal>
  );
}

export default React.forwardRef(ImageViewerComponent);
