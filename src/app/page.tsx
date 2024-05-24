"use client";
import Sidebar from "./components/Sidebar";
import BoardTasks from "./components/BoardTasks";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "./utils/firebaseConfig";
import { useCallback, useEffect, useState } from "react";
import { getSession, SessionProvider } from "next-auth/react";
import { data } from "./utils/data";
import AddAndEditBoardModal from "@components/AddAndEditBoardModal";
import AddAndEditTaskModal from "@components/AddAndEditTaskModal";
import DeleteBoardOrTaskModal from "@components/DeleteBoardAndTaskModal";

export default function Home() {
  const [userDetails, setUserDetails] = useState<{ [key: string]: any }>();

  const getUserSession = async () => {
    const session = await getSession();
    if (session) {
      setUserDetails(session.user);
    }
  };

  const handleAddDoc = useCallback(async () => {
    if (userDetails) {
      const docRef = collection(db, "users", userDetails.email, "tasks");
      const getDos = await getDocs(docRef);
      if (getDos.docs.length > 0) {
        return;
      } else {
        try {
          await addDoc(collection(db, "users", userDetails.email, "tasks"), data);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }
    }
  }, [userDetails]);

  useEffect(() => {
    getUserSession();
  }, []);

  useEffect(() => {
    handleAddDoc();
  }, [handleAddDoc]);

  return (
    <>
      <main className="flex h-full">
        <Sidebar />
        <BoardTasks />
        <AddAndEditBoardModal />
        <AddAndEditTaskModal />
        <DeleteBoardOrTaskModal />
      </main>
    </>
  );
}
