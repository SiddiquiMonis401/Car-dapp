import type { NextPage } from 'next'
import Head from 'next/head'
import { HStack, Heading, Box, Spacer } from '@chakra-ui/layout'
import { Text, Button, Flex } from '@chakra-ui/react'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import ReadCars from '@/components/car-detail-with-transfer'
import RegisterCar from '@/components/add-car'

declare let window: any

const contractAddress = '0x498C11c5B91bAdE275eDbfD9995215B1e42120Ad';

const Home: NextPage = () => {
  const [balance, setBalance] = useState<string | undefined>()
  const [currentAccount, setCurrentAccount] = useState<string | undefined>()
  const [chainId, setChainId] = useState<number | undefined>()
  const [chainname, setChainName] = useState<string | undefined>()

  useEffect(() => {
    if (!currentAccount || !ethers.utils.isAddress(currentAccount)) return
    //client side code
    if (!window.ethereum) return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    provider.getBalance(currentAccount).then((result) => {
      setBalance(ethers.utils.formatEther(result))
    })
    provider.getNetwork().then((result) => {
      setChainId(result.chainId)
      setChainName(result.name)
    })
  }, [currentAccount])

  const onClickConnect = () => {
    //client side code
    if (!window.ethereum) {
      console.log('please install MetaMask')
      return
    }

    //we can do it using ethers.js
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // MetaMask requires requesting permission to connect users accounts
    provider
      .send('eth_requestAccounts', [])
      .then((accounts: string | any[]) => {
        if (accounts.length > 0) setCurrentAccount(accounts[0])
      })
      .catch((e: any) => console.log(e))
  }

  const onClickDisconnect = () => {
    console.log('onClickDisConnect')
    setBalance(undefined)
    setCurrentAccount(undefined)
  }

  return (
    <>
      <Head>
        <title>CAR REG DAPP</title>
      </Head>

      <Box h="100%" w="100%" my={4}>
        <Flex justifyContent="center">
          <Heading as="h3" my={4}>
            My Car App
          </Heading>
        </Flex>
      </Box>
      <Spacer />
      <HStack h="100%" alignItems="stretch" justifyContent="center">
        <Flex direction="column" w="50%">
          <Box w="100%">
            {currentAccount ? (
              <Button type="button" w="100%" onClick={onClickDisconnect}>
                Account:{currentAccount}
              </Button>
            ) : (
              <Button type="button" w="100%" onClick={onClickConnect}>
                Connect MetaMask
              </Button>
            )}
          </Box>
          <Box height="20px" />
          {currentAccount ? (
            <Box mb={0} p={4} w="100%" borderWidth="1px" borderRadius="lg">
              <Heading my={4} fontSize="xl">
                Account info
              </Heading>
              <Text>ETH Balance of current account: {balance}</Text>
              <Text>
                <>
                  Chain Info: ChainId {chainId} name {chainname}
                </>
              </Text>
            </Box>
          ) : (
            <></>
          )}
          <Box mb={0} p={4} w="100%" borderWidth="1px" borderRadius="lg">
            <Heading my={4} fontSize="xl">
              Search Car
            </Heading>
            <ReadCars
              addressContract={contractAddress}
              currentAccount={currentAccount}
            />
          </Box>
        </Flex>
        <Box mb={0} p={4} w="100%" borderWidth="1px" borderRadius="lg">
          <Heading my={4} fontSize="xl">
            Register Car
          </Heading>
          <RegisterCar
            addressContract={contractAddress}
            currentAccount={currentAccount}
          />
        </Box>
      </HStack>
    </>
  )
}

export default Home
