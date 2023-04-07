import React, { useState } from 'react'
import {Button, Input , useToast,  FormControl,  FormLabel, Box } from '@chakra-ui/react'
import {ethers} from 'ethers'
import data from '../abis/car-contract'
import { Contract } from "ethers"
import { TransactionResponse,TransactionReceipt } from "@ethersproject/abstract-provider"

interface Props {
  addressContract: string,
  currentAccount: string
  carPrice: number
  carId: number
}

declare let window: any;


export default function TransferCar(props:Props){

  const toast = useToast();

  const addressContract = props.addressContract
  const currentAccount = props.currentAccount
  const carId = props.carId
  const price = props.carPrice

  
  const [toAddress, setToAddress] = useState('');

  
  const [transferLoader, setTransferLoader] = useState(false);

  async function transferCar(event:React.FormEvent) {
    event.preventDefault()
    if(!window.ethereum) return    
    setTransferLoader(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const carContract:Contract = new ethers.Contract(addressContract, JSON.stringify(data.abi), signer)
    const carPrice = ethers.utils.parseEther(price.toString()); // 1 ether




    carContract.connect(signer).transferCar(carId, { value: carPrice })
      .then((tr: TransactionResponse) => {
        console.log(`TransactionResponse TX hash: ${tr.hash}`)
        tr.wait().then((receipt:TransactionReceipt)=>{console.log("transfer receipt",receipt)});
        setTransferLoader(false);
        toast({
          title: 'Car Transferred Successfully',
          description: "Your car has been registered1",
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      })
      .catch((e:Error)=>{
        toast({
          title: 'Error Occurred While transferring the car',
          description: JSON.stringify(e).slice(10),
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        setTransferLoader(false);
      })

  }


  const handleChange = (value: string) => {
    setToAddress(value);
  }

  return (
    <form onSubmit={transferCar}>
    <FormControl>
      <FormLabel htmlFor='name'>Account Address To Transfer Car To</FormLabel>
      <Input id="carId" type="text" required  onChange={(e) => handleChange(e.target.value)} />
      <Box height="20px" />
      <Button type="submit"  isDisabled={!currentAccount || transferLoader || !toAddress}>Transfer Car</Button>
    </FormControl>
    </form>
  )
}