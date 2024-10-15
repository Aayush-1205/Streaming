import { Flex, Progress, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { Triangle } from 'react-loader-spinner'

const Spinner = ({ msg, warn, progress, loader }) => {

    useEffect(() => {}, [progress])

    return (
        <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'} height={'100vh'} px={10} cursor={'progress'}>
            {loader && (
                <Triangle
                
                    visible={true}
                    height="90"
                    width="90"
                    color="#00BFFF"
                    ariaLabel="triangle-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />
            )}

            <Text fontSize={20} textAlign={'center'} px={2} my={4}>{msg}</Text>

            {progress && (
                <Progress mt={5} isAnimated size={'xs'} value={Number.parseInt(progress)} width={'lg'} rounded={'sm'} colorScheme='linkedin'></Progress>
            )}

            <Text fontSize={12} textAlign={'center'} color={'gray.500'} mt={2} w={'80%'}>{warn}</Text>
        </Flex>
    )
}

export default Spinner