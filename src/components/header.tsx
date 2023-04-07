import {
  Flex,
  Button,
  useColorModeValue,
  Spacer,
  Heading,
  Box,
} from '@chakra-ui/react'

const siteTitle = 'Car Registration DAPP'
export default function Header() {
  return (
    <Flex
      as="header"
      bg={useColorModeValue('gray.100', 'gray.900')}
      p={4}
      alignItems="center"
    >
      <Heading size="md">{siteTitle}</Heading>

      <Spacer />
      <Button>Powered By ethereum & Hardhat </Button>
    </Flex>
  )
}
