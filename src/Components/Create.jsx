import React, { useEffect, useRef, useState } from 'react'
import { Button, Flex, FormLabel, Image, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { IoChevronDown, IoCloudUpload, IoWarningOutline } from 'react-icons/io5'
import { categories } from '../data'
import { FaLocationDot } from 'react-icons/fa6'
import Spinner from './Spinner'

import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, } from "firebase/storage";
import { collection, setDoc, getFirestore, doc } from "firebase/firestore";
import { firebaseApp } from "../firebase-config";
import { upload } from '@testing-library/user-event/dist/upload'
import { FaTrashAlt } from 'react-icons/fa'
import AlertMsg from './AlertMsg'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import { Editor } from '@tinymce/tinymce-react'
import { fetchUser } from "../utils/fetchUser";
import { useNavigate } from 'react-router-dom'

const Create = () => {

  const { colorMode } = useColorMode()
  const bg = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.900', 'gray.50')

  const editorRef = useRef(null)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Choose a category')
  const [location, setLocation] = useState('')
  const [videoAsset, setVideoAsset] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(1)
  const [alert, setAlert] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertIcon, setAlertIcon] = useState(null);
  const [description, setDescription] = useState("");

  const storage = getStorage(firebaseApp)
  const firestoreDb = getFirestore(firebaseApp)

  const navigate = useNavigate();

  const [userInfo] = fetchUser();

  const uploadImage = (e) => {
    setLoading(true)
    const videoFile = e.target.files[0];

    const storeageRef = ref(storage, `Videos/${Date.now()}-${videoFile.name}`)

    const uploadTask = uploadBytesResumable(storeageRef, videoFile)

    uploadTask.on('state_changed', (snapshot) => {
      const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgress(uploadProgress)
    }, (error) => {
      console.log(error)
    }, () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        // console.log(`File available at ${downloadURL}`);
        setVideoAsset(downloadURL)
        setLoading(false);
        setAlert(true)
        setAlertStatus('success')
        setAlertIcon(<IoIosCheckmarkCircleOutline fontSize={25} />)
        setAlertMsg('Video uploaded successfully!')
        setTimeout(() => {
          setAlert(false)
        }, 4000);
      })
    })
  }

  const deleteImage = () => {
    const deleteRef = ref(storage, videoAsset)
    deleteObject(deleteRef).then(() => {
      setVideoAsset(null)
      setAlert(true)
      setAlertStatus('error')
      setAlertIcon(<IoWarningOutline fontSize={25} />)
      setAlertMsg('You have removed the video')
      setTimeout(() => {
        setAlert(false)
      }, 4000);
    })
  }

  const getDescriptionValue = () => {
    if (editorRef.current) {
      // console.log(editorRef.current.getContent());
      setDescription(editorRef.current.getContent());
    }
  }

  const uploadDetails = async () => {
    try {
      setLoading(true)
      if (!title && !category & !videoAsset) {
        setAlert(true);
        setAlertStatus("error");
        setAlertIcon(<IoWarningOutline fontSize={25} />);
        setAlertMsg("Required Fields are missing!");
        setTimeout(() => {
          setAlert(false);
        }, 4000);
        setLoading(false);
      } else {
        const data = {
          id: `${Date.now()}`,
          title: title,
          userId: userInfo?.uid,
          category: category,
          location: location,
          videoUrl: videoAsset,
          description: description,
        };
        await setDoc(doc(firestoreDb, "videos", `${Date.now()}`), data);
        setLoading(false);
        navigate("/", {replace: true});
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => { }, [title, location, description, category])

  return (
    <Flex justifyContent={'center'} alignItems='center' width={'full'} height='full' padding={{base: "0", md: "10"}}>

      <Flex width={{base: "full", md: "80%"}} height={'full'} border={'1px'} borderColor='gray.300' borderRadius={'md'} p={'3'} flexDirection={'column'} alignItems='center' justifyContent={'center'} gap={2}>

        {alert && (
          <AlertMsg status={alertStatus} msg={alertMsg} icon={alertIcon} />
        )}

        <Input variant={'flushed'} placeholder='Title' focusBorderColor='gray.400' isRequired errorBorderColor='red' type='text' _placeholder={{ color: 'gray.500' }} fontSize={{base: "15", md: "20"}} value={title} onChange={(e) => setTitle(e.target.value)} />

        <Flex justifyContent={'space-between'} width='full' alignItems={'center'} gap={8} my={4}>

          <Menu>
            <MenuButton fontSize={{base: "15", md: "20"}} display={'flex'} alignItems={'center'} width={'full'} colorScheme='blue' as={Button} rightIcon={<IoChevronDown fontSize={22} />}>
              {category}
            </MenuButton>
            <MenuList zIndex={101} width={"md"} shadow="xl">
              {categories &&
                categories.map((data) => (
                  <MenuItem
                    key={data.id}
                    _hover={{ bg: "blackAlpha.300" }}
                    fontSize={20}
                    px={4}
                    onClick={() => setCategory(data.title)}
                  >
                    {data.iconSrc} <Text ml={4}>{data.title}</Text>
                  </MenuItem>
                ))}
            </MenuList>
          </Menu>

          {/* <InputGroup>
            <Input
              variant="flushed"
              placeholder="Location"
              focusBorderColor={"gray.400"}
              isRequired
              errorBorderColor={"red"}
              type="text"
              _placeholder={{ color: "gray.500" }}
              fontSize={{base: "15", md: "20"}}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </InputGroup> */}

        </Flex>

        {/* Video/Image Uploader */}
        <Flex border={'1px'} borderColor='gray.500' height={{base: "250px", md: "400px"}} borderStyle='dashed' width="full" borderRadius={'md'} overflow='hidden' position={'relative'}>
          {!videoAsset ? (
            <FormLabel width={"full"}>
              <Flex
                direction={"column"}
                alignItems="center"
                justifyContent={"center"}
                height="full"
                width={"full"}
              >
                <Flex flexDirection={'column'} alignItems={'center'} justifyContent={'center'} height={'full'} width={'full'} cursor={'pointer'}>
                  {loading ? (<Spinner msg={'Uploading Your Video...'} progress={progress} warn={'(large file takes time to upload)'} />) : (
                    <>
                      <IoCloudUpload fontSize={30} color={`${colorMode == 'dark' ? '#f1f1f1' : '#111'}`} />

                      <Text mt={5} fontSize={20} color={textColor}>
                        Click to upload
                      </Text>
                    </>
                  )}
                </Flex>
              </Flex>

              {!loading && (
                <input type='file' name='upload-image' onChange={uploadImage} style={{ width: 0, height: 0 }} accept='video/mp4,video/x-m4v,video/*' />
              )}
            </FormLabel>
          ) : (
            <Flex
              width={"full"}
              height="full"
              justifyContent={"center"}
              alignItems={"center"}
              bg="black"
              position={"relative"}
            >
              <Flex justifyContent={'center'} alignItems={'center'} width={'40px'} height={'40px'} rounded={'full'} bg={'red'} top={5} right={5} position={'absolute'} cursor={"pointer"} zIndex={10}
                onClick={deleteImage}
              >
                <FaTrashAlt fontSize={20} color='white' />
              </Flex>

              <video src={videoAsset} controls style={{ width: "100%", height: "100%" }}></video>
            </Flex>
          )}
        </Flex>

        <Editor
          onChange={getDescriptionValue}
          onInit={(evt, editor) => (editorRef.current = editor)}
          apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
          init={{
            height: 400,
            width: "100%",
            menubar: false,
            plugins: [
              "advlist", "autolink", 'charmap', "lists", "link", "image", "charmap", "print", "preview", "anchor",
              "searchreplace", "visualblocks", "code", "fullscreen",
              "insertdatetime", "media", "table", "paste", "code", "help", "wordcount", "quickbars",
            ],
            toolbar:
              "undo redo | formatselect | " +
              "bold italic backcolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help | image" + 'charmap',
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            content_css: "dark",
            skin: "oxide-dark",
          }}
        />

        {/* Submiting Button */}
        <Button
          isLoading={loading}
          loadingText="Uploading..."
          colorScheme="linkedin"
          variant={`${loading ? "outline" : "solid"}`}
          my={3}
          width={{base: "10rem", md:"lg"}}
          _hover={{ shadow: "lg" }}
          fontWeight={'medium'}
          fontSize={{base: "15", md: "20"}}
          onClick={() => uploadDetails()}
        >
          Upload
        </Button>
      </Flex>
    </Flex>
  )
}

export default Create