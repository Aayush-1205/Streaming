import { Button, Flex, Stack } from '@chakra-ui/react'
import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { firebaseApp } from "../firebase-config";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


const Login = () => {

    const firebaseAuth = getAuth(firebaseApp)
    const provider = new GoogleAuthProvider()
    const firestoreDb = getFirestore(firebaseApp)

    const navigate = useNavigate()

    const login = async () => {
        const { user } = await signInWithPopup(firebaseAuth, provider);
        // console.log(response)

        const { refreshToken, providerData } = user;

        localStorage.setItem('user', JSON.stringify(providerData))
        localStorage.setItem('accessToken', JSON.stringify(refreshToken))

        await setDoc(
            doc(firestoreDb, 'users', providerData[0].uid),
            providerData[0]
        )

        navigate('/', { replace: true })
    }

    return (
        <Flex justifyContent={'center'} alignItems={'center'} width={'100w'} height={'100vh'} position={'relative'} bgGradient={'linear-gradient( 181.2deg, rgba(136,80,226,1) 4%, rgba(16,13,91,1) 96.5% )'}>
            <Stack>
                <Button leftIcon={<FcGoogle fontSize={25} />} colorScheme='whiteAlpha.800' shadow={'xl'} onClick={() => login()}>
                    Sign in with Google
                </Button>
            </Stack>
        </Flex>
    )
}

export default Login