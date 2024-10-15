import { getFirestore } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { firebaseApp } from '../firebase-config'
import { categoryFeeds, getAllFeeds } from '../utils/fetchData'
import Spinner from './Spinner'
import { SimpleGrid } from '@chakra-ui/react'
import VideoPin from './VideoPin'
import { useParams } from 'react-router-dom'
import NotFound from './NotFound'

const Feed = () => {

  const firestoreDb = getFirestore(firebaseApp)

  const [feeds, setFeeds] = useState(null)
  const [loading, setLoading] = useState(false)
  const { categoryId } = useParams()

  useEffect(() => {
    setLoading(true)
    if (categoryId) {
      categoryFeeds(firestoreDb, categoryId).then((data) => {
        setFeeds(data)
        setLoading(false)
      })
    } else {
      getAllFeeds(firestoreDb).then(data => {
        // console.log(data);
        setFeeds(data)
        setLoading(false)
      })
    }
  }, [categoryId])

  if (loading) return <Spinner loader={true} msg={'Loading your videos...'} warn={'( if it takes too much time to load then check your internet connection or contact the developer )'} />

  if (!feeds?.length > 0) return <NotFound text={`( The Category you are looking for  is not available or you haven't uploaded any video yet )`} />


  return (
    <SimpleGrid minChildWidth="300px"
      columns={{ sm: 2, md: 3 }}
      spacing="20px"
      width={"full"}
      height={'full'}
      px={2}
    // overflowX="hidden"
    >
      {feeds && feeds.map((data) => {
        return <VideoPin key={data.id} maxWidth={420} height='80px' data={data} />
      })}
    </SimpleGrid>
  )
}

export default Feed