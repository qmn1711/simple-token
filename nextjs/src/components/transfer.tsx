import { useForm } from 'react-hook-form'
import { FormControl, FormLabel, Input, FormErrorMessage, Button, Flex, Spinner, Text } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { transferTo } from 'state/slice'

function Transfer() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm()
  const firstToken = useAppSelector((state) => state.web3State.tokens[0])
  const txTransfering = useAppSelector((state) => state.transfering)
  const txErrorMsg = useAppSelector((state) => state.transferErrors)
  const dispatch = useAppDispatch()

  const submitHandler = (values) => {
    // do something
    console.log('submitHandler', values)
    dispatch(transferTo(values))
  }

  console.log('txErrorMsg', txErrorMsg)

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Flex direction="column" w="100%">
        <FormControl isInvalid={errors.amount}>
          <FormLabel htmlFor="amount">
            Amount of {firstToken.symbol} ({firstToken?.balance?.toString()})
          </FormLabel>
          <Input
            id="amount"
            placeholder="amount"
            {...register('amount', {
              required: 'This is required',
              // min: { value: 0, message: 'Minimum length should be 4' },
              validate: {
                positive: (v) => parseInt(v) > 0 || 'should be greater than 0',
                lessThanTen: (v) =>
                  parseInt(v) < firstToken?.balance?.toNumber() || 'should be lower than your balance',
              },
            })}
          />
          <FormErrorMessage>{errors.amount && errors.amount.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.toAddress} mt={4}>
          <FormLabel htmlFor="toAddress">Recipient address</FormLabel>
          <Input
            id="toAddress"
            placeholder="toAddress"
            {...register('toAddress', {
              required: 'This is required',
              pattern: {
                value: /^0x[a-fA-F0-9]{40}$/g,
                message: 'shoud be an valid ethereum address',
              },
            })}
          />
          <FormErrorMessage>{errors.toAddress && errors.toAddress.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.toAddress} mt={4}>
          {txTransfering ? (
            <Spinner />
          ) : (
            <>
              <Button
                color={['white', 'white', 'white', 'white']}
                bg={['black', 'black', 'primary.500', 'primary.500']}
                isLoading={isSubmitting}
                type="submit"
              >
                Submit
              </Button>
              {txErrorMsg && (
                <Text mt="3" color="red">
                  {txErrorMsg}
                </Text>
              )}
            </>
          )}
        </FormControl>
      </Flex>
    </form>
  )
}

export default Transfer
