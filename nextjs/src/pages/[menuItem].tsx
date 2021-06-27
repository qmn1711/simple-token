import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Flex, Box } from '@chakra-ui/layout'

const MenuItem: NextPage = () => {
  const router = useRouter()
  const { menuItem } = router.query

  return (
    <Flex
      align="center"
      justify={{ base: 'center', md: 'center', xl: 'center' }}
      direction={{ base: 'column', md: 'row' }}
      minH="70vh"
      w={{ base: '100%', sm: '100%', md: '90%' }}
      px={8}
      mb={16}
    >
      <Box>{menuItem}&apos;s content</Box>
    </Flex>
  )
}

export default MenuItem
