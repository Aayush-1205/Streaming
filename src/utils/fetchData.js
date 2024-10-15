import {
  collection,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { firebaseApp } from "../firebase-config";

export const getAllFeeds = async (fireStoreDb) => {
  const feeds = await getDocs(
    query(collection(fireStoreDb, "videos"), orderBy("id", "desc"))
  );
  return feeds.docs.map((doc) => doc.data());
};

export const categoryFeeds = async (fireStoreDb, categoryId) => {
  const feeds = await getDocs(
    query(
      collection(fireStoreDb, "videos"),
      where("category", "==", categoryId),
      orderBy("id", "desc")
    )
  );
  return feeds.docs.map((doc) => doc.data());
};

export const recommendedFeed = async (firestoreDb, categoryId, videoId) => {
  const feeds = await getDocs(
    query(
      collection(firestoreDb, "videos"),
      where("category", "==", categoryId),
      where("id", "!=", videoId),
      orderBy("id", "desc")
    )
  );
  return feeds.docs.map((doc) => doc.data());
};

export const userUploadedVideos = async (fireStoreDb, userId) => {
  const feeds = await getDocs(
    query(
      collection(fireStoreDb, "videos"),
      where("userId", "==", userId),
      orderBy("id", "desc")
    )
  );
  return feeds.docs.map((doc) => doc.data());
};

export const getUserInfo = async (firestoreDb, userId) => {
  const userRef = doc(firestoreDb, "users", userId);

  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    return "No Such Document";
  }
};

export const getSpecificVideo = async (firestoreDb, videoId) => {
  const videoRef = doc(firestoreDb, "videos", videoId);

  const videoSnap = await getDoc(videoRef);
  if (videoSnap.exists()) {
    return videoSnap.data();
  } else {
    return "No Such Document";
  }
};

export const deleteVideo = async (firestoreDb, videoId) => {
  await deleteDoc(doc(firestoreDb, "videos", videoId));
};
