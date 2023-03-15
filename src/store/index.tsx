import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';

import rootEpic from '@epics';
import reducers from '@reducers';

const epicMiddleware = createEpicMiddleware();

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(epicMiddleware)),
);

epicMiddleware.run(rootEpic);

export default store;
