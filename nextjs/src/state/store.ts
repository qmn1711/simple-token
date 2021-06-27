import { applyMiddleware, createStore, Store } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createWrapper, Context } from 'next-redux-wrapper'

import rootReducer from './slice'
import rootSaga from './saga'

const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension') // eslint-disable-line @typescript-eslint/no-var-requires
    return composeWithDevTools(applyMiddleware(...middleware))
  }
  return applyMiddleware(...middleware)
}

const sagaMiddleware = createSagaMiddleware()
const store = createStore(rootReducer, bindMiddleware([sagaMiddleware]))

export const makeStore = (context: Context) => {
  // const sagaMiddleware = createSagaMiddleware()
  // const store = createStore(rootReducer, bindMiddleware([sagaMiddleware]))

  ;(store as any).sagaTask = sagaMiddleware.run(rootSaga)

  return store
}

export type AppState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export const wrapper = createWrapper<Store<AppState>>(makeStore, { debug: true })
