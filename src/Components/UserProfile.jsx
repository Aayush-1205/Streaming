import React, { useEffect, useState } from 'react'
import Spinner from './Spinner'
import { Flex, Image, Text } from '@chakra-ui/react'
import { getFirestore } from 'firebase/firestore'
import { firebaseApp } from '../firebase-config'
import { getUserInfo, userUploadedVideos } from '../utils/fetchData'
import { useParams } from 'react-router-dom'
import RecommendedVideos from './RecommendedVideos'

const randomImage = 'https://picsum.photos/seed/nature,photography,technology/1600/900'
// const randomImage = 'https://picsum.photos/1600/900'

const UserProfile = () => {

  const { userId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [feeds, setFeeds] = useState(null);

  const firestoreDb = getFirestore(firebaseApp);

  useEffect(() => {
    setIsLoading(true);

    if (userId) {
      getUserInfo(firestoreDb, userId).then((user) => {
        setUserInfo(user);
      });
      userUploadedVideos(firestoreDb, userId).then((feed) => {
        setFeeds(feed);
      })
      setIsLoading(false);
    }
  }, [userId]);
  if (isLoading) return <Spinner loader={true} warn={'( if it takes too much time to load then check your internet connection or contact the developer )'} />

  return (
    <Flex alignItems={'center'} justifyContent={'center'} width={'full'} height={'auto'} p={2} flexDirection={'column'}>
      <Flex justifyContent={'center'} width={'full'} position={'relative'} flexDirection={'column'} alignItems={'center'}>
        <Image src={randomImage} height={{base: "150px", md: '280px'}} width={'full'} objectFit={'cover'} borderRadius={'md'} />
        <Image
          src={userInfo?.photoURL}
          width={{base: "5rem", md: "8rem"}}
          objectFit={"cover"}
          border="2px"
          borderColor={"gray.100"}
          rounded="full"
          shadow={"lg"}
          mt="-16"
        />
        <Text fontSize={{base: "16", md: "25"}} my={1} fontWeight={'semibold'}>{userInfo?.displayName}</Text>
      </Flex>
      {feeds && (
        <Flex flexDirection={'column'} width={'full'} my={2}>
          <Text fontSize={{base: "14", md: "20"}} my={4} fontWeight={'semibold'}>Your Videos</Text>
          <RecommendedVideos feeds={feeds} />
        </Flex>
      )}
    </Flex>
  )
}

export default UserProfile