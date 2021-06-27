import { useState, ReactNode, forwardRef } from 'react'
import Link from 'next/link'
import { Box, Flex, Text, Button, Stack, Tag } from '@chakra-ui/react'
import { StarIcon, CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import { useAppSelector } from 'state/hooks'
import ConnectWallet from './connect-wallet'

type Props = {
  children: ReactNode
  isLast?: boolean
  to: string
}

const MenuItems = (props: Props) => {
  const { children, isLast, to = '/', ...rest } = props
  return (
    <Text mb={{ base: isLast ? 0 : 8, sm: 0 }} mr={{ base: 0, sm: isLast ? 0 : 8 }} display="block" {...rest}>
      <Link href={to}>{children}</Link>
    </Text>
  )
}

const Header = (props) => {
  const [show, setShow] = useState(false)
  const toggleMenu = () => setShow(!show)

  const isWeb3Support = useAppSelector((state) => state.web3State.isWeb3Support)

  console.log('Header - isWeb3Support', isWeb3Support)

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      px={50}
      py={8}
      bg={[show ? '#e3e3e3' : 'transparent', show ? '#e3e3e3' : 'transparent', '#e3e3e3', '#e3e3e3']}
      color={['black', 'black', 'primary.700', 'primary.700']}
      {...props}
    >
      <Flex align="left">
        <Link href="/" passHref>
          <a>
            <StarIcon color={['black', 'black', 'primary.500', 'primary.500']} />
          </a>
        </Link>
      </Flex>

      <Box display={{ base: 'block', md: 'none' }} onClick={toggleMenu}>
        {show ? <CloseIcon /> : <HamburgerIcon />}
      </Box>

      <Box display={{ base: show ? 'block' : 'none', md: 'block' }} flexBasis={{ base: '100%', md: 'auto' }}>
        <Flex
          align={['center', 'center', 'center', 'center']}
          justify={['center', 'space-between', 'flex-end', 'flex-end']}
          direction={['column', 'row', 'row', 'row']}
          pt={[4, 4, 0, 0]}
        >
          <MenuItems to="/maecenas">Maecenas Ipsum </MenuItems>
          <MenuItems to="/vitae">Vitae Ipsum </MenuItems>
          <MenuItems to="/donec">Donec Ipsum </MenuItems>
          <MenuItems to="/morbi">Morbi Ipsum </MenuItems>

          {isWeb3Support ? <ConnectWallet /> : <Tag>Please install Metamask</Tag>}
        </Flex>
      </Box>
    </Flex>
  )
}

export default Header
