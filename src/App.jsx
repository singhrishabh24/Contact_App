/** @format */

import Navbar from "./components/Navbar";
import { FiSearch } from "react-icons/fi";
import { AiFillPlusCircle } from "react-icons/ai";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./config/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContactCard from "./components/ContactCard";
import AddAndUpdateContact from "./components/AddAndUpdateContact";
import useDisclouse from "./hooks/useDisclouse";
import NotFoundContact from "./components/notFoundContact";
function App() {
  const [contacts, setContacts] = useState([]);
  const { onClose, isOpen, onOpen } = useDisclouse();
  useEffect(() => {
    const getContacts = async () => {
      try {
        const ContactsRef = collection(db, "contacts");
        onSnapshot(ContactsRef, (snapshot) => {
          const contactLists = snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          });
          setContacts(contactLists);
          return contactLists;
        });
      } catch (error) {
        console.log(error);
      }
    };
    getContacts();
  }, []);

  const filterContacts = (e) => {
    const value = e.target.value;
    const ContactsRef = collection(db, "contacts");
    onSnapshot(ContactsRef, (snapshot) => {
      const contactLists = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      const filteredContacts = contactLists.filter((contact) =>
        contact.name.toLowerCase().includes(value.toLowerCase())
      );
      setContacts(filteredContacts);
      return filteredContacts;
    });
  };

  return (
    <>
      <div className=' mx-auto max-w-[370px] px-4'>
        <Navbar />
        <div className=' flex gap-2 '>
          <div className=' relative flex flex-grow items-center '>
            <FiSearch className=' absolute ml-1 text-3xl text-white' />
            <input
              onChange={filterContacts}
              type='text'
              className=' flex-grow h-10 rounded-md border border-white bg-transparent pl-9 text-white'
            />
          </div>
          <AiFillPlusCircle
            className=' cursor-pointer text-5xl text-white'
            onClick={onOpen}
          />
        </div>
        <div className=' mt-4 flex flex-col gap-3 '>
          {contacts.length <= 0 ? (
            <NotFoundContact />
          ) : (
            contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
              />
            ))
          )}
        </div>
      </div>
      <AddAndUpdateContact
        onClose={onClose}
        isOpen={isOpen}
      />
      <ToastContainer position='bottom-center' />
    </>
  );
}

export default App;
