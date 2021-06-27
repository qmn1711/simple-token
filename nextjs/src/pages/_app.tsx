import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { Flex } from '@chakra-ui/layout'

import '../styles/globals.css'
import { wrapper } from '../state/store'
import { ReactNode, useEffect } from 'react'
import { useAppDispatch } from 'state/hooks'
import { landedClient } from 'state/slice'
import Header from 'components/header'
import Footer from 'components/footer'

declare global {
  interface Window {
    ethereum: any
  }
}

type Props = {
  children: ReactNode
}

const BaseLayout = (props: Props) => {
  return (
    <Flex direction="column" align="center" m="0 auto" {...props}>
      <Header />
      {props.children}
      <Footer />
    </Flex>
  )
}

function App({ Component, pageProps }: AppProps) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(landedClient())
  }, [dispatch])

  console.log('App render')

  return (
    <ChakraProvider>
      <BaseLayout>
        <Component {...pageProps} />
      </BaseLayout>
    </ChakraProvider>
  )
}

export default wrapper.withRedux(App)
