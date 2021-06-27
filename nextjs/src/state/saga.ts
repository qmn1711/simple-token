import {
  all,
  call,
  cancel,
  cancelled,
  delay,
  fork,
  put,
  select,
  take,
  takeLatest,
  takeLeading,
} from 'redux-saga/effects'
import { ethers } from 'ethers'
import { eventChannel } from 'redux-saga'

import rootReducer, {
  landedClient,
  updateWeb3State,
  connectWalletAction,
  resetWeb3State,
  chainChanged,
  accountsChanged,
  updateTransferErrors,
  updateTransfering,
  transferTo,
} from './slice'
import TokenArtifact from 'contracts/Token.json'
import contractAddress from 'contracts/contract-address.json'

const HARDHAT_NETWORK_ID = '31337'
const ERROR_CODE_TX_REJECTED_BY_USER = 4001

// Workaround type AppState
export type AppState = ReturnType<typeof rootReducer>

function* setupClientLanding() {
  yield take(landedClient.toString())
  const web3Support = {
    isWeb3Support: window.ethereum !== undefined,
  }

  if (web3Support.isWeb3Support) {
    yield put(updateWeb3State(web3Support))
    const ethereumChan = yield call(ethereumEvents)
    yield takeLeading(ethereumChan, watchEthereumEvents)
  }
}

function ethereumEvents() {
  return eventChannel((emitter) => {
    window.ethereum.on('connect', function (data) {
      emitter({ type: 'connect', payload: data })
    })

    window.ethereum.on('disconnect', function (data) {
      emitter({ type: 'disconnect', payload: data })
    })

    window.ethereum.on('accountsChanged', function (data: string[]) {
      console.log('accountsChanged')
      emitter({ type: 'accountsChanged', payload: data })
    })

    // We reset the dapp state if the network is changed
    window.ethereum.on('chainChanged', function (data: string) {
      emitter({ type: 'chainChanged', payload: data })
    })

    return () => {} // eslint-disable-line @typescript-eslint/no-empty-function
  })
}

function* watchEthereumEvents(action) {
  switch (action.type) {
    case 'accountsChanged':
      yield put(accountsChanged(action.payload[0]))
      break
    case 'chainChanged':
      const selectedAddress = yield select((state: AppState) => state.web3State.selectedAddress)
      yield put(chainChanged(selectedAddress))

      break
  }
}

function* connectWallet() {
  try {
    const [selectedAddress] = yield window.ethereum.request({ method: 'eth_requestAccounts' })
    const transferTask = yield takeLatest(transferTo.toString(), watchTransfer)
    let task = yield fork(setupAddress, selectedAddress)

    while (true) {
      const { payload } = yield take([accountsChanged.toString(), chainChanged.toString()])
      console.log('watch changes', payload)
      yield cancel(task)
      task = yield fork(setupAddress, payload)
    }
  } catch (error) {
    if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
      yield put(updateWeb3State({ connectedWalletError: 'Please connect to MetaMask.' }))
    }
  }
}

function* updateBalance(token, address) {
  const balance = yield token.balanceOf(address)
  return balance
}

function* setupAddress(address: string) {
  try {
    const chainId = yield window.ethereum.request({ method: 'eth_chainId' })
    const rightNetwork = parseInt(chainId, 16).toString() === HARDHAT_NETWORK_ID
    yield put(updateWeb3State({ selectedAddress: address, rightNetwork }))

    if (rightNetwork) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const token = new ethers.Contract(contractAddress.Token, TokenArtifact.abi, provider.getSigner(0))
      const name = yield token.name()
      const symbol = yield token.symbol()
      yield put(updateWeb3State({ provider, tokens: [{ token, name, symbol }] }))

      while (true) {
        const balance = yield call(updateBalance, token, address)
        yield put(updateWeb3State({ tokens: [{ token, name, symbol, balance }] }))
        yield delay(3000)
      }
    }
  } catch (error) {
    console.log('setupAddress - error', error)
    yield put(updateWeb3State({ connectedWalletError: error }))
  } finally {
    if (yield cancelled()) {
      console.log('setupAddress - finally - cancelled')
      yield put(resetWeb3State())
    }
  }
}

function* watchTransfer(action) {
  console.log('watchTransfer', action)
  const { toAddress, amount } = action.payload
  try {
    yield put(updateTransferErrors(''))
    const firstToken = yield select((state: AppState) => state.web3State.tokens[0])
    const selectedAddress = yield select((state: AppState) => state.web3State.selectedAddress)
    const tx = yield firstToken.token.transfer(toAddress, amount)
    yield put(updateTransfering(true))
    const receipt = yield tx.wait()
    if (receipt.status === 0) {
      throw new Error('Transaction failed')
    }
    const balance = yield call(updateBalance, firstToken.token, selectedAddress)
    yield put(updateWeb3State({ tokens: [{ ...firstToken, balance }] }))
  } catch (error) {
    if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
      yield put(updateTransferErrors('User rejected.'))
      return
    }
    console.error(error)
    yield put(updateTransferErrors(JSON.stringify(error)))
  } finally {
    yield put(updateTransfering(false))
  }
}

function* rootSaga() {
  yield all([setupClientLanding(), takeLatest(connectWalletAction.toString(), connectWallet)])
}

export default rootSaga
