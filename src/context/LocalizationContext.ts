import React from 'react';

import { ILocalization } from '@models/types';

export const LocalizationContext = React.createContext<ILocalization>({
  t: null,
  locale: 'en',
  setLocale: null,
});
