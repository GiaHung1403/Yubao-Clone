import React, { forwardRef, useContext, useRef } from 'react';

import ActionSheet from './ActionSheet';

// tslint:disable:no-empty
const context = React.createContext({
  showActionSheet: (options) => {
  },
  hideActionSheet: () => {
  },
});

export const useActionSheet = () => useContext(context);

const { Provider, Consumer } = context;

export const withActionSheet = Component => forwardRef((props, ref) => (
  <Consumer>
    {contexts => <Component {...props} {...contexts} ref={ref}/>}
  </Consumer>
));

export const ActionSheetProvider = React.memo(({ children }) => {
  const ref = useRef<any>();

  const getContext = () => ({
    showActionSheet: (options) => {
      ref.current?.showActionSheet(options);
    },
    hideActionSheet: () => {
      ref.current?.hideActionSheet();
    },
  });

  return (
    <Provider value={getContext()}>
      {/*@ts-ignore*/}
      <ActionSheet ref={ref}>
        {children}
      </ActionSheet>
    </Provider>
  );
});
