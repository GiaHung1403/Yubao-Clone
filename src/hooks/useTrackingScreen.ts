import React, { useEffect } from 'react';

import * as firebaseFunction from '@data/firebase';
import { EventTracking } from '@models/EventTrackingEnum';

interface IScreenObject {
  class: string;
  name: string;
}

export default (screen: IScreenObject) => {
  useEffect(() => {
    firebaseFunction.trackingLog({
      event: EventTracking.SCREEN,
      screen,
    }).then();
  }, []);
};
