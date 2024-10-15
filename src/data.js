import { MdMovie, MdMusicNote, MdOutlineWebAsset } from "react-icons/md";
import { BsInfoCircleFill } from "react-icons/bs";
import { SiMyanimelist } from "react-icons/si";
import { RiSlideshow3Fill } from "react-icons/ri";

export const categories = [
  { id: 1, title: "Infomative", iconSrc: <BsInfoCircleFill fontSize={25} /> },
  { id: 2, title: "Movies", iconSrc: <MdMovie fontSize={25} /> },
  { id: 3, title: "Music", iconSrc: <MdMusicNote fontSize={25} /> },
  { id: 4, title: "Tv Series", iconSrc: <RiSlideshow3Fill fontSize={25} /> },
  { id: 5, title: "Web Series", iconSrc: <MdOutlineWebAsset fontSize={25} /> },
  { id: 6, title: "Anime", iconSrc: <SiMyanimelist fontSize={25} /> },
];
