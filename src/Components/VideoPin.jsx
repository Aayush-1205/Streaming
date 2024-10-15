import { Flex, Image, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getUserInfo } from '../utils/fetchData'
import { getFirestore } from 'firebase/firestore'
import { firebaseApp } from '../firebase-config'
import moment from 'moment'

const VideoPin = ({ data }) => {

  const stopVideo = (e) => {
    e.target.currentTime = 0;
    e.target.pause();
  }

  const { colorMode } = useColorMode()
  const bg = useColorModeValue('blackAlpha.700', 'gray.900')
  const textColor = useColorModeValue('gray.100', 'gray.100')
  const avatar = 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'

  const firestoreDb = getFirestore(firebaseApp)

  const [userId, setUserId] = useState(null)
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    if (data) setUserId(data.userId)
    if (userId) getUserInfo(firestoreDb, userId).then((data) => {
      setUserInfo(data)
    })
  }, [userId])

  return (
    <Flex
      width={"full"}
      height={"fit-content"}
      justifyContent="space-between"
      alignItems="center"
      direction={"column"}
      cursor={'pointer'}
      rounded={'md'}
      overflow={'hidden'}
      position={'relative'}
      maxWidth={'300px'}
      maxHeight={'400px'}
      px={2}
      py={1}
      _hover={{ transform: 'scale(1.1)', translate: '30px 5px', }}
    >
      <Link to={`/video/${data.title}/${data.id}`}>
        <video src={data.videoUrl} muted onMouseOver={(e) => e.target.play()}
          onMouseOut={(e) => stopVideo(e)}></video>

        <Flex position={'absolute'} bottom={'0'} left={'0'} px={2} py={1} bg={bg} width='full' flexDirection={'column'}>
          <Flex width={'full'} justifyContent={'space-between'} alignItems={'center'}>
            <Text color={textColor} isTruncated fontSize={15} fontWeight={500}>
              {data.title}
            </Text>

            <Link to={`/user/${userInfo?.displayName}/${userInfo?.uid}`}>
              <Image
                src={userInfo?.photoURL ? userInfo?.photoURL : avatar}
                rounded={"full"}
                width={"40px"}
                height={"40px"}
                minWidth={"40px"}
                maxHeight={"40px"}
                border={"1px"}
                borderColor={bg}
                mt={-10}
              />
            </Link>
          </Flex>
          <Text fontSize={12} color={textColor} ml={"auto"}>
            {moment(new Date(parseInt(data.id)).toISOString()).fromNow()}
          </Text>
        </Flex>
      </Link>
    </Flex>
  )
}

export default VideoPin