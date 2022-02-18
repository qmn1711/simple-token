import { Flex, Stack, Heading, Box } from '@chakra-ui/layout'
import { Code } from '@chakra-ui/react'

import ConnectWallet from './connect-wallet'
import Transfer from './transfer'

export default function HomeContent(props: any) {
  const { ...rest } = props

  return (
    <Flex
      align="center"
      justify={{ base: 'center', md: 'center', xl: 'space-between' }}
      direction={{ base: 'column', md: 'row' }}
      wrap="no-wrap"
      minH="70vh"
      w={{ base: '100%', sm: '100%', md: '90%' }}
      px={8}
      mb={16}
      {...rest}
    >
      <Stack
        spacing={4}
        w={{ base: '80%', md: '40%' }}
        minW="250px"
        align={['center', 'center', 'flex-start', 'flex-start']}
      >
        <div>Just another place for Wallet</div>
        <ConnectWallet />
      </Stack>
      <Box w={{ base: '90%', sm: '100%', md: '80%' }} mt={{ base: 12, md: 0 }}>
        <Code mb="10">
          Import this private key, will have MHT tokens (Ropsten)
          <p>
            <code>b9075ff2e114c4bcc879164fbac493420da1c9a7c688a6baa05b1677fc4d43b4</code>
          </p>
        </Code>
        <Transfer />
      </Box>
    </Flex>
  )
}
