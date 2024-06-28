import React from 'react'
import { Category, Create, Feed, Navbar, SearchBar, UserProfile, VideoDetails } from '../Components';
import { Flex } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';
import { categories } from '../data';

const Home = ({ user }) => {

  return (
    <>
      <Navbar user={user} />

      <Flex width={'full'} >
        <Flex flexDirection={'column'} justifyContent='start' alignItems={'center'} width={{base: '15%', md: "10%", lg: "5%"}}>
          {categories && categories.map((data) => <Category key={data.id} data={data} />)}
        </Flex>

        <Flex width={"full"} justifyContent="center" alignItems="center" px={4}>
          <Routes>
            <Route path='/' element={<Feed />} />
            <Route path='/category/:categoryId' element={<Feed />} />
            <Route path='/create' element={<Create />} />
            <Route path='/video/:videoTitle/:videoId' element={<VideoDetails />} />
            <Route path='/user/:userName/:userId' element={<UserProfile />} />
            <Route path='/search' element={<SearchBar />} />
          </Routes>
        </Flex>
      </Flex>
    </>
  )
}

export default Home