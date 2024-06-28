import React, { useEffect, useState } from 'react'
import { Flex, Image, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { IoAdd, IoSearch } from 'react-icons/io5'
import { FaMoon, FaSun } from 'react-icons/fa6'
import { IoIosLogOut } from 'react-icons/io'
import { RiMenu4Line } from 'react-icons/ri'

const Navbar = ({ user }) => {
    const { colorMode, toggleColorMode } = useColorMode()
    const bg = useColorModeValue('gray.600', 'gray.300')
    const avatar = 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
    const navigate = useNavigate()


    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    let hourString;
    let ampm;

    if (hours === 0) {
        hourString = 12;
        ampm = 'AM';
    } else if (hours === 12) {
        hourString = 12;
        ampm = 'PM';
    } else if (hours > 12) {
        hourString = hours - 12;
        ampm = 'PM';
    } else {
        hourString = hours;
        ampm = 'AM';
    }

    const minuteString = minutes < 10 ? `0${minutes}` : minutes;
    const secondString = seconds < 10 ? `0${seconds}` : seconds;

    return (
        <Flex justifyContent={'space-between'} alignItems={'center'} width={"100vw"} px={{base: "4", md: "2"}} py={4}>
            <Link to={'/'} >
                <Text fontSize={'2rem'} ml={{ base: "0", md: "1rem" }} fontFamily={'aladin'}>Streaming</Text>
            </Link>

            {/* Search */}
            {/* <InputGroup mx={6} width={'60vw'} display={{base: "none", md: "flex", }}>
                <InputLeftElement pointerEvents={'none'} children={<IoSearch fontSize={22} />} />

                <Input type='text' placeholder='Search' fontSize={18} fontWeight={'medium'} variant={'filled'} />
            </InputGroup> */}

            <Flex alignItems={'center'} gap={4}>
                <Text>
                    {hourString}:{minuteString}:{secondString} {ampm}
                </Text>

                <Flex justifyContent={'center'} alignItems={'center'} display={{ base: "none", md: "flex" }}>
                    <Flex width={'40px'} height={'40px'} justifyContent={'center'} alignItems={'center'} cursor={'pointer'} borderRadius={'5px'} onClick={toggleColorMode}>
                        {colorMode == 'light' ? (<FaMoon fontSize={22} />) : (<FaSun fontSize={22} />)}
                    </Flex>

                    <Link to={'/create'} >
                        <Flex justifyContent={'center'} alignItems='center' bg={bg} width='40px' height='40px' borderRadius="5px" mx={6} cursor={'pointer'} _hover={{ shadow: 'md' }} transition='ease-in-out' transitionDelay={'0.3s'} >
                            <IoAdd fontSize={25} color={`${colorMode == "dark" ? "#111" : "#f1f1f1"}`} />
                        </Flex>
                    </Link>
                    {/* {console.log(user)} */}
                </Flex>

                {/* Profile */}
                <Menu>
                    <MenuButton>
                        <Image src={user?.photoURL ? user?.photoURL : avatar} width='40px' height='40px' rounded={'full'} />
                    </MenuButton>
                    <MenuList shadow={'lg'}>
                        <Link to={`/user/${user?.displayName}/${user?.uid}`}>
                            <MenuItem>My Account</MenuItem>
                        </Link>
                        <MenuDivider />
                        <MenuItem onClick={() => {
                            localStorage.clear()
                            navigate("/login", { replace: true })
                        }} flexDirection={'row'} alignItems='center' gap={2}>Logout <IoIosLogOut fontSize={20} /></MenuItem>
                    </MenuList>
                </Menu>

                {/* Mobile Menu */}
                <Flex display={{ base: "block", md: "none" }}>
                    <Menu>
                        <MenuButton><RiMenu4Line size={22} /></MenuButton>
                        <MenuList>
                            <MenuItem>
                                <Link to={'/create'}>
                                    <Flex fontWeight={'medium'} alignItems={'center'} gap={4} cursor={'pointer'} _hover={{ shadow: 'md' }} transition='ease-in-out' transitionDelay={'0.3s'} >
                                        <IoAdd size={25} color={`${colorMode == "dark" ? "#f1f1f1" : "#111"}`} /> Upload
                                    </Flex>
                                </Link>
                            </MenuItem>

                            <MenuItem onClick={toggleColorMode} display={'flex'} alignItems={'center'} fontWeight={'medium'} gap={4}>
                                {colorMode == 'light' ? (<FaMoon fontSize={22} />) : (<FaSun fontSize={22} />)}  Change Theme
                            </MenuItem>

                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Navbar