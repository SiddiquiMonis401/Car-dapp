import React, { useState } from 'react'
import {
  Button,
  Input,
  useToast,
  FormControl,
  FormLabel,
  Box,
  Text,
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import data from '../abis/car-contract'
import { Contract } from 'ethers'
import {
  TransactionResponse,
  TransactionReceipt,
} from '@ethersproject/abstract-provider'

interface Props {
  addressContract: string
  currentAccount: string
  owner: string
  carPrice: number
  carId: number
}

declare let window: any

export default function TransferCar(props: Props) {
  const toast = useToast()

  const addressContract = props.addressContract
  const currentAccount = props.currentAccount
  const carId = props.carId
  const price = props.carPrice

  const [transferLoader, setTransferLoader] = useState(false)

  async function transferCar() {
    if (!window.ethereum) return
    setTransferLoader(true)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const carContract: Contract = new ethers.Contract(
      addressContract,
      JSON.stringify(data.abi),
      signer
    )
    const carPrice = price.toString()

    carContract
      .connect(signer)
      .transferCar(carId, { value: carPrice })
      .then((tr: TransactionResponse) => {
        console.log(`TransactionResponse TX hash: ${tr.hash}`)
        tr.wait().then((receipt: TransactionReceipt) => {
          console.log('transfer receipt', receipt)
        })
        setTransferLoader(false)
        toast({
          title: 'Transaction Registered Success!',
          description: 'Transaction has been sent to chain - You can track the status of tx from wallet UI (Thanks)',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      })
      .catch((e: Error) => {
        toast({
          title: 'Error Occurred While transferring the car',
          description: JSON.stringify(e).slice(10),
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        setTransferLoader(false)
      })
  }

  const isOwner = currentAccount?.toLowerCase() == props.owner.toLowerCase();

  return (
    <>
      <Button onClick={transferCar} isDisabled={!currentAccount || transferLoader || isOwner}>
        Transfer Car
      </Button>
      {isOwner && (
        <Box>
          <Text>
            Car can't be transfer to owner ! Please change the account to do
            this transaction
          </Text>
        </Box>
      )}
    </>
  )
}
