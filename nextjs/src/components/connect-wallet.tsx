import { Box, Button, HStack, Text, Flex } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { connectWalletAction, Web3State } from 'state/slice'
import { shortEthAddress } from 'utils'

// type Props = {}

const ConnectedWallet = (props: Web3State) => {
  const token = props.tokens[0]

  return (
    <Box
      size="sm"
      rounded="lg"
      color={['white', 'white', 'white', 'white']}
      bg={['black', 'black', 'primary.500', 'primary.500']}
      _hover={{
        bg: ['primary.100', 'primary.100', 'primary.600', 'primary.600'],
      }}
      px="2"
      py="1"
      d="flex"
      alignItems="center"
    >
      <HStack spacing="10px">
        <Box>{props.rightNetwork ? 'Ropsten' : 'Wrong Network'}</Box>
        <Box>{shortEthAddress(props.selectedAddress)}</Box>
        <Box>{`${token.balance ? token.balance.toString() : 0} ${props.tokens[0].symbol}`}</Box>
      </HStack>
    </Box>
  )
}

export default function ConnectWallet() {
  const dispatch = useAppDispatch()
  const web3State = useAppSelector((state) => state.web3State)

  const clickHandler = () => {
    dispatch(connectWalletAction())
  }

  return web3State.selectedAddress ? (
    <ConnectedWallet {...web3State} />
  ) : (
    <Flex direction="column">
      <Button
        size="sm"
        rounded="md"
        color={['white', 'white', 'white', 'white']}
        bg={['black', 'black', 'primary.500', 'primary.500']}
        _hover={{
          bg: ['primary.100', 'primary.100', 'primary.600', 'primary.600'],
        }}
        onClick={clickHandler}
      >
        Connect Wallet
      </Button>
      {web3State.connectedWalletError && <Text color="red">{web3State.connectedWalletError}</Text>}
    </Flex>
  )
}
