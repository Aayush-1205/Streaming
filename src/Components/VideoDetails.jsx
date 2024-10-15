import { Box, Breadcrumb, BreadcrumbItem, Button, Flex, Grid, GridItem, Image, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { GoHomeFill } from 'react-icons/go'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Spinner from './Spinner'
import { deleteVideo, getSpecificVideo, getUserInfo, recommendedFeed, recommendedFeeds } from '../utils/fetchData'
import { firebaseApp } from '../firebase-config'
import { getFirestore } from 'firebase/firestore'
import ReactPlayer from 'react-player'
import { FaPause, FaPlay, FaVolumeHigh, FaVolumeXmark } from 'react-icons/fa6'
import { MdForward10, MdFullscreen, MdReplay10 } from 'react-icons/md'
import screenfull from 'screenfull'
import HTMLReactParser from 'html-react-parser'
import { FcApproval } from 'react-icons/fc'
import moment from 'moment'
import { fetchUser } from '../utils/fetchUser'
import { FaTrashAlt } from 'react-icons/fa'
import { HiDownload } from 'react-icons/hi'
import RecommendedVideos from './RecommendedVideos'

const format = (seconds) => {
    if (isNaN(seconds)) {
        return "00:00";
    }

    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");

    if (hh) {
        return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`
        // 01:25:58
    }

    return `${mm}:${ss}`;
    // 05:30
}

const VideoDetails = () => {

    const [isLoading, setIsLoading] = useState(false)
    const textColor = useColorModeValue('gray.900', 'gray50')
    const { onOpen, onClose, isOpen } = useDisclosure()
    const navigate = useNavigate()

    const { videoId } = useParams();
    const firestoreDb = getFirestore(firebaseApp)
    const [localUser] = fetchUser()
    const avatar = 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'

    const [hover, setHover] = useState(true)
    const [videoInfo, setVideoInfo] = useState(null)
    const [userInfo, setUserInfo] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [muted, setMuted] = useState(false)
    const [volume, setVolume] = useState(0.7)
    const [played, setPlayed] = useState(0);
    const [seeking, setSeeking] = useState(false);
    const [feeds, setFeeds] = useState(null)

    const mouseOn = () => {
        setTimeout(() => {
            setHover(false)
        }, 5000)
        setHover(true)
    }

    // Refs
    const playerRef = useRef()
    const playerContainer = useRef()

    const onVolumeChange = (e) => {
        setVolume(parseFloat(e / 100))
        e === 0 ? setMuted(true) : setMuted(false)
        // console.log(e);
    }


    const handleFastForward = () => {
        playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10)
    }

    const handleFastRewind = () => {
        playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10)
    }

    const handleProgress = (p) => {
        if (!seeking) {
            setPlayed(parseFloat(p.played / 100) * 100)
        }
    }

    const handleSeekChange = (e) => {
        setPlayed(parseFloat(e / 100))
    }

    const onSeekMouseDown = (e) => {
        setSeeking(true)
    }
    const onSeekMouseUp = (e) => {
        setSeeking(false)
        playerRef.current.seekTo(parseFloat(e / 100))
    }

    const currentTime = playerRef.current ? playerRef.current.getCurrentTime() : "00:00";
    const duration = playerRef.current ? playerRef.current.getDuration() : "00:00";

    const elapsedTime = format(currentTime)
    const totalDuration = format(duration)
    const remainingTime = format(duration - currentTime);

    const deleteTheVideo = (videoId) => {
        setIsLoading(true)
        deleteVideo(firestoreDb, videoId)
        navigate("/", { replace: true })
    }

    useEffect(() => {
        if (videoId) {
            setIsLoading(true)
            getSpecificVideo(firestoreDb, videoId).then(data => {
                setVideoInfo(data);

                recommendedFeed(firestoreDb, data.category, videoId).then((feed) => {
                    setFeeds(feed)
                })

                getUserInfo(firestoreDb, data.userId).then((user) => {
                    setUserInfo(user);
                })

                setIsLoading(false)
                // console.log(data);
            })
        };
    }, [videoId])

    useEffect(() => {

    }, [muted, volume, played])

    useEffect(() => {
        const handleKeydown = (event) => {
            switch (event.key) {
                case 'm':
                    setMuted(!muted);
                    break;
                case 'k':
                    setIsPlaying(!isPlaying);
                    break;
                case ' ':
                    setIsPlaying(!isPlaying);
                    break;
                case 'Enter':
                    setIsPlaying(!isPlaying);
                    break;
                case "6":
                    handleFastForward();
                    break;
                case "4":
                    handleFastRewind();
                    break;
                case "f":
                    screenfull.toggle(playerContainer.current)
                    break;

                default:
                // console.log(event.key);
            }
        };

        document.addEventListener('keydown', handleKeydown);

        return () => {
            document.removeEventListener('keydown', handleKeydown);
        };
    }, [muted, isPlaying]);

    if (isLoading) return <Spinner loader={true} warn={'( if it takes too much time to load then check your internet connection or contact the developer )'} />

    // With this code we change the html tag code into text
    const htmlLine = videoInfo?.description
    const parser = new DOMParser();
    const desc = parser.parseFromString(htmlLine, 'text/html').body.textContent;

    return (

        <Flex width={'full'} height={'auto'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'} py={2} px={{ base: "2", md: "4" }}>
            <Flex alignItems={'center'} width={'full'} my={4}>

                <Breadcrumb fontWeight='medium' fontSize='sm'>
                    <BreadcrumbItem>
                        <Link to={'/'}>
                            <GoHomeFill size={22} />
                        </Link>
                    </BreadcrumbItem>

                    <BreadcrumbItem isCurrentPage>
                        <Text isTruncated color={textColor} width={'full'}>{videoInfo?.title}</Text>
                    </BreadcrumbItem>
                </Breadcrumb>
            </Flex>

            <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={2} width={'100%'}>
                <GridItem colSpan={2} width={'100%'} p={2}>
                    {/* Video Player */}
                    <Flex width={'full'} bg={'black'} position={'relative'} ref={playerContainer}>
                        <ReactPlayer url={videoInfo?.videoUrl} width={'100%'} height={'100%'} playing={isPlaying} muted={muted} volume={volume} ref={playerRef} onProgress={handleProgress} />

                        {/* Controls */}
                        <Flex onClick={mouseOn} position={'absolute'} top={{ base: "55px", md: "0" }} left={0} right={0} bottom={0} flexDirection={'column'} justifyContent={{ base: "center", md: 'space-between' }} gap={{ base: "3", md: "0" }} alignItems={'center'} zIndex={3} cursor={'pointer'}>

                            {hover && (
                                <>
                                    {/* Play Icon */}
                                    <Flex alignItems={'center'} justifyContent={'center'} onClick={() => setIsPlaying(!isPlaying)} width={{ base: "1.5rem", md: "full" }} height={{ base: "1.5rem", md: "full" }}>
                                        {!isPlaying && (
                                            <FaPlay fontSize={60} color='#f2f2f2' cursor={'pointer'} />
                                        )}
                                    </Flex>

                                    {/* Duration of the video */}
                                    <Flex alignItems={'center'} justifyContent={'space-between'} px={4} width={'full'}>
                                        <Text fontSize={{ base: "10", md: "16" }} color={'#f2f2f2'} fontWeight='semibold' textShadow={"1px 1px #000"}>
                                            {elapsedTime}
                                        </Text>
                                        {/* <Text fontSize={16} color={'whitesmoke'}>
                                    /
                                </Text> */}
                                        <Text fontSize={{ base: "10", md: "16" }} color={'#f2f2f2'} fontWeight='semibold' textShadow={"1px 1px #000"}>
                                            {remainingTime}
                                        </Text>
                                    </Flex>

                                    <Flex
                                        width={"full"}
                                        alignItems="center"
                                        direction={"column"}
                                        bgGradient="linear(to-t, blackAlpha.900, blackAlpha.500, blackAlpha.50)"
                                        px="4"
                                    >

                                        <Slider
                                            aria-label="slider-ex-4"
                                            min={0}
                                            max={100}
                                            value={played * 100}
                                            transition={'ease-in-out'}
                                            transitionDuration={'0.5'}
                                            onChange={handleSeekChange}
                                            onMouseDown={onSeekMouseDown}
                                            onChangeEnd={onSeekMouseUp}
                                        >
                                            <SliderTrack bg="teal.50">
                                                <SliderFilledTrack bg="teal.300" />
                                            </SliderTrack>

                                            <SliderThumb transition={'ease-in-out'}
                                                transitionDuration={'0.5'} boxSize={{ base: "3", md: "6" }} />
                                        </Slider>

                                        {/* Other Controls */}
                                        <Flex width={'full'} alignItems={'center'} justifyContent={{ base: "space-around", md: 'space-between' }} my={2}>
                                            <Flex alignItems={'center'} gap={{ base: "5", md: "10" }}>
                                                <Flex alignItems={'center'} gap={{ base: "3", md: "5" }}>

                                                <span className='text-[2rem] cursor-pointer' onClick={handleFastRewind} ><MdReplay10 size={22} /></span>

                                                    <Box onClick={() => setIsPlaying(!isPlaying)}>
                                                        {!isPlaying ? (
                                                            <FaPlay className='' color='#f2f2f2' cursor={'pointer'} />
                                                        ) : (
                                                            <FaPause className='' color='#f2f2f2' cursor={'pointer'} />
                                                        )}
                                                    </Box>

                                                    <span className='text-[2rem] cursor-pointer' onClick={handleFastForward} ><MdForward10 size={22} /></span>
                                                </Flex>

                                                {/* Volume Controls */}
                                                <Flex alignItems={'center'} gap={2}>
                                                    <Box onClick={() => setMuted(!muted)}>
                                                        {!muted ? (
                                                            <FaVolumeHigh className='w-96 h-96' color='#f1f1f1' cursor={'pointer'} />
                                                        ) : (
                                                            <FaVolumeXmark className='w-96 h-96' color='#f1f1f1' cursor={'pointer'} />
                                                        )}
                                                    </Box>

                                                    <Slider
                                                        aria-label="slider-ex-4"
                                                        defaultValue={volume * 100}
                                                        min={0}
                                                        max={100}
                                                        size={'sm'}
                                                        width={{ base: "10", md: "16" }}
                                                        onChangeStart={onVolumeChange}
                                                        onChangeEnd={onVolumeChange}
                                                    >
                                                        <SliderTrack bg="teal.50">
                                                            <SliderFilledTrack bg="teal.300" />
                                                        </SliderTrack>

                                                        <SliderThumb boxSize={{ base: "2", md: "3" }} bg="teal.300" />
                                                    </Slider>
                                                </Flex>
                                            </Flex>

                                            <Flex alignItems={'center'} gap={5}>
                                                {/* Logo */}
                                                <Link to={'/'} >
                                                    <Text fontSize={{ base: "1rem", md: "1.5rem" }} fontFamily={'aladin'} ml={{ base: "0", md: "1rem" }}>Streaming</Text>
                                                </Link>

                                                <MdFullscreen fontSize={25} color={'white'} cursor={'pointer'} onClick={() => {
                                                    screenfull.toggle(playerContainer.current)
                                                }} />
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                </>
                            )}
                        </Flex>
                    </Flex>

                    {/* Video Description */}
                    {videoInfo?.description && (
                        <Flex my={6} flexDirection={'column'}>
                            <Text my={2} fontSize={{ base: "20", md: "25" }} fontWeight={'semibold'}>
                                Description
                            </Text>
                            <Flex width={'full'} height={'1px'} bg={'gray.500'} mb={4}></Flex>
                            <Text fontSize={{ base: "15", md: "20" }}>
                                {HTMLReactParser(videoInfo?.description)}
                            </Text>
                        </Flex>
                    )}
                </GridItem>
                <GridItem colSpan={1} width={'100%'} p={2}>
                    {userInfo && (
                        <Flex flexDirection={'column'} width={'full'}>
                            <Flex alignItems={'center'} width={'full'}>
                                <Link to={`/user/${userInfo?.displayName}/${userInfo?.uid}`}>
                                    <Image
                                        src={userInfo?.photoURL ? userInfo?.photoURL : avatar}
                                        rounded={"full"}
                                        width={{ base: "40px", md: "60px" }}
                                        height={{ base: "40px", md: "60px" }}
                                        // minWidth={"60px"}
                                        // maxHeight={"60px"}
                                        shadow={'lg'}
                                    />
                                </Link>

                                <Flex flexDirection={'column'} ml={'3'}>
                                    <Flex alignItems={'center'} gap={1}>
                                        <Text isTruncated color={textColor} fontSize={{ base: "12", md: "15" }} fontWeight={'semibold'}>{userInfo?.displayName}</Text>
                                        <FcApproval />
                                    </Flex>
                                    {videoInfo?.id && (
                                        <Text fontSize={{ base: "10", md: "12" }}>
                                            {moment(new Date(parseInt(videoInfo.id)).toISOString()).fromNow()}
                                        </Text>
                                    )}
                                </Flex>
                            </Flex>

                            {/* Action Button */}
                            <Flex mt={4} justifyContent={'space-around'}>
                                {
                                    userInfo?.uid === localUser.uid && (
                                        <Popover closeOnEsc onOpen={onOpen} isOpen={isOpen} onClose={onClose}>
                                            <PopoverTrigger>
                                                <Button px={{ base: "10", md: "10" }} width={'50%'} bg={'red'} color={'white'} fontSize={{ base: "small", md: "medium" }} gap={2}>Delete <FaTrashAlt fontSize={15} color='#fff' /></Button>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <PopoverArrow />
                                                <PopoverCloseButton />
                                                <PopoverHeader>Confirmation!</PopoverHeader>
                                                <PopoverBody>Are you sure you want to delete it ?</PopoverBody>

                                                <PopoverFooter border='0' display="flex" alignItems={'center'} gap={2} width={'full'}>
                                                    <Button bg={'red'} color={'white'} width={'full'} onClick={() => deleteTheVideo(videoId)}>Yes</Button>
                                                    <Button onClick={onClose} border={'1px'} borderColor={'transparent'} _hover={{ border: '1px' }} width={'full'}>Cancel</Button>
                                                </PopoverFooter>

                                            </PopoverContent>
                                        </Popover>
                                    )
                                }

                                <a target='_blank' href={videoInfo.videoUrl} download={videoInfo.videoUrl} onClick={(e) => e.stopPropagation()}>
                                    <Button bg={'green'} color={'white'} rounded={'md'} fontSize={{ base: "small", md: "medium" }} margin={5} mt={"0"} width={'full'} gap={2}>
                                        Download <HiDownload size={22} color='#fff' />
                                    </Button>
                                </a>
                            </Flex>
                        </Flex>
                    )}
                </GridItem>
            </Grid>

            {/* Recommended Videos */}
            {feeds && (
                <Flex flexDirection={'column'} width={'full'} my={6}>
                    <Text fontSize={{ base: "20", md: "25" }} my={4} fontWeight={'semibold'}>Recommended Videos</Text>
                    <RecommendedVideos feeds={feeds} />
                </Flex>
            )}
        </Flex>
    )
}

export default VideoDetails

