import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BigNumber, ethers } from 'ethers'
import { HYDRATE } from 'next-redux-wrapper'

export interface Token {
  token?: ethers.Contract | undefined | any
  name?: string
  symbol?: string
  balance?: BigNumber
}

export interface Web3State {
  isWeb3Support?: boolean
  selectedAddress?: string
  balance?: number
  rightNetwork?: boolean
  provider?: ethers.providers.Web3Provider | undefined | any
  tokens?: Token[]
  connectedWalletError?: string
}

interface AppState {
  web3State: Web3State
  transferErrors: string
  transfering: boolean
  count: number
  error: any
  lastUpdate: number
  light: boolean
  placeholderData: any[]
}

const initialState: AppState = {
  web3State: {
    isWeb3Support: false,
    selectedAddress: '',
    balance: 0,
    rightNetwork: false,
    provider: null,
    tokens: [
      {
        token: null,
        name: '',
        symbol: '',
        balance: null,
      },
    ],
    connectedWalletError: '',
  },
  transferErrors: '',
  transfering: false,
  count: 0,
  error: false,
  lastUpdate: 0,
  light: false,
  placeholderData: null,
}

const appSlice = createSlice({
  name: 'app-logic',
  initialState,
  reducers: {
    // TODO seperate big state into smaller chunks for avoiding unnecessary re-rendering
    updateWeb3State(state, action: PayloadAction<Web3State>) {
      state.web3State = { ...state.web3State, ...action.payload }
    },
    resetWeb3State(state) {
      state.web3State = { ...initialState.web3State, isWeb3Support: true }
    },
    updateTransferErrors(state, action: PayloadAction<string>) {
      state.transferErrors = action.payload
    },
    updateTransfering(state, action: PayloadAction<boolean>) {
      state.transfering = action.payload
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action: PayloadAction<any>) => {
      return { ...state, ...action.payload }
    },
  },
})

export const landedClient = createAction('landedClient')
export const connectWalletAction = createAction('connectWalletAction')
export const accountsChanged = createAction<string>('accountsChanged')
export const chainChanged = createAction<string>('chainChanged')
export const transferTo = createAction<{ toAddress: string; amount: string }>('transferTo')
export const { updateWeb3State, resetWeb3State, updateTransferErrors, updateTransfering } = appSlice.actions

const rootReducer = appSlice.reducer
export default rootReducer
