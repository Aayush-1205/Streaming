import React, { useEffect, useState } from 'react'
import { getAllFeeds } from '../utils/fetchData'
import Spinner from './Spinner'
import { SimpleGrid } from '@chakra-ui/react'
import VideoPin from './VideoPin'

const RecommendedVideos = ({feeds}) => {

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

export default RecommendedVideos