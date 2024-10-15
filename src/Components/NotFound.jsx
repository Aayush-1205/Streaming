import { Button, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";

const NotFound = ({ text }) => {

    const navigate = useNavigate()

    return (
        <Flex
            width={"full"}
            height={'75vh'}
            justifyContent={"center"}
            alignItems={"center"}
            direction="column"
        >
            <Text fontSize={{base: "2rem", md: "3rem"}} fontWeight="semibold" fontFamily={"aladin"}>
                Not Found 404
            </Text>

            <Flex flexDirection={'column'} gap={5} alignItems={'center'} justifyContent={'center'} textAlign={'center'}>
                <Text fontSize={{base: '0.7rem', md: '1.1rem'}} width={'70%'}>
                    {text}
                </Text>

                <Button onClick={() => navigate('/')} leftIcon={<IoIosArrowRoundBack size={25} />} colorScheme='teal' variant='outline' display={'flex'} alignItems={'center'} fontSize={{ base: "0.8rem", md: "1.5rem"}}>
                    Go Back
                </Button>
            </Flex>
        </Flex>
    );
};

export default NotFound;