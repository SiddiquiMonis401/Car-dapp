import React, { useEffect, useState } from 'react'
import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spacer,
  Text,
} from '@chakra-ui/react'
import data from '../abis/car-contract'
import { ethers } from 'ethers'
import TransferCar from './car-transfer'

interface Props {
  addressContract: string
  currentAccount: string | undefined
}

type CarDetails = {
  name: string
  model: string
  year: number
  owner: string
  price: number
}

declare let window: any

export default function ShowCarById(props: Props) {
  const addressContract = props.addressContract
  const currentAccount = props.currentAccount

  const [car, setCar] = useState<CarDetails>()
  const [carId, setCarId] = useState<number>()

  useEffect(() => {
    if (!window.ethereum) return

    if (!carId) return

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    provider.getCode(addressContract)
    const carContract = new ethers.Contract(
      addressContract,
      JSON.stringify(data.abi),
      provider
    )

    carContract
      .carMap(carId)
      .then((result: CarDetails) => {
        setCar(result)
      })
      .catch((error: any) => {
        console.log('Error occured', error)
      })
    //called only once
  }, [carId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(e.target.value)
    if (id > 0) setCarId(id)
    else setCarId(undefined)
  }

  
  return (
    <Box my={10}>
      <FormControl>
        <FormLabel htmlFor="carId">Car Id</FormLabel>
        <Input
          id="carId"
          type="number"
          required
          onChange={handleChange}
          placeholder="Enter a valid car id"
          size="lg"
        />
      </FormControl>

      <Divider my={10} />

      {(carId && car && car.name !== '')  && (
        <Box>
          <Text fontSize="3xl" mb={6}>
            Car Details
          </Text>
          <Divider />
          <Flex direction="column" my={4}>
            <Text fontSize="sm">
              <b>Car Name:</b> {car?.name}
            </Text>
            <Text fontSize="sm">
              <b>Car Model:</b> {car?.model}
            </Text>
            <Text fontSize="sm">
              <b>Car Owner:</b> {car?.owner}
            </Text>
            <Text fontSize="sm">
              <b>Car Price:</b> {car?.price.toString()}
            </Text>
            <Divider />
            <Divider />
            <Divider />
            <Divider />
            <Spacer />
            <TransferCar
              carPrice={car?.price}
              addressContract={addressContract}
              currentAccount={currentAccount!}
              carId={carId}
            />
          </Flex>
        </Box>
      )}
      {
        carId &&  car?.name == '' && <Text>
          Car is not registered with ID provided!
        </Text>
      }

      {!carId && (
        <Box mt={10}>
          <Text fontSize="2xl" textAlign="center">
            Please enter a valid car id to view car details
          </Text>
        </Box>
      )}
    </Box>
  )
}
