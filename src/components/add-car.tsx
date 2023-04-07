import React, { useState } from 'react'
import {Button, Input , useToast,  FormControl,  FormLabel } from '@chakra-ui/react'
import {ethers} from 'ethers'

import data from '../abis/car-contract'
import { Contract } from "ethers"
import { TransactionResponse,TransactionReceipt } from "@ethersproject/abstract-provider"

interface Props {
    addressContract: string,
    currentAccount: string | undefined
}


type CarDetails = {
  carId: number;
  name: string;
  model: string;
  year: number;
  owner: string;
  price: number;
}

declare let window: any;


export default function RegisterCar(props:Props){

  const toast = useToast();

  const addressContract = props.addressContract
  const currentAccount = props.currentAccount

  const initCarDetails = {
    carId: 0,
    name: '',
    model: '',
    year: 2000,
    owner: '',
    price: 0,
  }

  const [carDetails, setCarDetails] = useState<CarDetails>(initCarDetails);

  const resetCarDetails = () => {
    setCarDetails(initCarDetails);
  }
  
  const [addCarLoader, setAddCarLoader] = useState(false);

  async function addCar(event:React.FormEvent) {
    event.preventDefault()
    if(!window.ethereum) return    
    setAddCarLoader(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const carContract:Contract = new ethers.Contract(addressContract, JSON.stringify(data.abi), signer)


    const {name, model, year, owner, carId: id, price} = carDetails;

    carContract.addCar(name, model, year, owner, id, price)
      .then((tr: TransactionResponse) => {
        console.log(`TransactionResponse TX hash: ${tr.hash}`)
        tr.wait().then((receipt:TransactionReceipt)=>{console.log("transfer receipt",receipt)});
        setAddCarLoader(false);
        resetCarDetails();
        toast({
          title: 'Car added successfully',
          description: "Your car has been registered1",
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      })
      .catch((e:Error)=>{
        toast({
          title: 'Error Occurred While adding the car',
          description: JSON.stringify(e),
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        resetCarDetails();
        setAddCarLoader(false);
      })

  }

  const handleChange = (value:string | number, key: string) => setCarDetails((prev: CarDetails): CarDetails  => ({...prev, [key]: value }))

  return (
    <form autoComplete="off" onSubmit={addCar}>
    <FormControl>
      <FormLabel htmlFor='name'>Car Id: </FormLabel>
      <Input id="carId" type="text" required  onChange={(e) => handleChange(parseInt(e.target.value), e.target.id)} my={3}/>
      <FormLabel htmlFor='name'>Name: </FormLabel>
      <Input id="name" type="text" required  onChange={(e) => handleChange(e.target.value, e.target.id)} my={3}/>
      <FormLabel htmlFor='model'>Model: </FormLabel>
      <Input id="model" type="text" required  onChange={(e) => handleChange(e.target.value, e.target.id)} my={3}/>
      <FormLabel htmlFor='name'>Year: </FormLabel>
      <Input id="year" type="text" required  onChange={(e) => handleChange(parseInt(e.target.value), e.target.id)} my={3}/>
      <FormLabel htmlFor='name'>Owner: </FormLabel>
      <Input id="owner" type="text" required  onChange={(e) => handleChange(e.target.value, e.target.id)} my={3}/>
      <FormLabel htmlFor='name'>Price: </FormLabel>
      <Input id="price" type="text" required  onChange={(e) => handleChange(e.target.value, e.target.id)} my={3}/>
      <Button type="submit"  isDisabled={!currentAccount || addCarLoader}>Add Car</Button>
    </FormControl>
    </form>
  )
}