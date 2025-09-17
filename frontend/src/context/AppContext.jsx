 import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats,dummyUserData } from "../assets/assets";


 export const Appcontext=createContext();
 export const AppcontextProvider=({children})=>{
    const navigate=useNavigate();
    const [user,setuser]=useState(null);
    const [chats,setchats]=useState([]);
    const [selectedChats,setSelectedChats]=useState(null);
    const [theme,setTheme]=useState(localStorage.getItem('theme')||'light');
    const fetchuser=async()=>{
setuser(dummyUserData);
    }
    const fetchuserchats=async()=>{
        setchats(dummyChats);
        setSelectedChats(dummyChats[0]);
    }
    useEffect(()=>{
  fetchuser();
    },[])
    useEffect(()=>{ 
    if(user){
        fetchuserchats();
    }
    else{
        setchats([]);
        setSelectedChats();
    }
    },[user])
    useEffect(()=>{
   if(theme==='dark'){
    document.documentElement.classList.add('dark');
   }
   else{
    document.documentElement.classList.remove('dark');
   }
   localStorage.setItem('theme',theme);
   
    },[theme])
    const value={navigate,user,setuser,fetchuser,chats,setchats,selectedChats,setSelectedChats,theme,setTheme};
    return(
        <Appcontext.Provider value={value}>
            {children}
        </Appcontext.Provider>
    )
 }
 export const useAppcontext=()=>useContext(Appcontext);