import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";
import toast from "react-hot-toast";
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

export const Appcontext = createContext();
export const AppcontextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setuser] = useState(null);
    const [chats, setchats] = useState([]);
    const [selectedChats, setSelectedChats] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loadinguser, setLoadinguser] = useState(true);

    const fetchuser = async () => {
        try {
            const { data } = await axios.get('/api/user/data', { headers: { Authorization: token } });
            if (data.success) {
                setuser(data.user);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoadinguser(false);
        }
    }

    const createchat = async () => {
        try {
            if (!user) {
                return toast('Login to create a new chat');
            }
            navigate('/');
            await axios.post('/api/chats/create', {}, { headers: { Authorization: token } });
            await fetchuserchats();
        } catch (err) {
            toast.error(err.message);
        }
    }

    const fetchuserchats = async () => {
        try {
            const { data } = await axios.get('/api/chats/receive', { headers: { Authorization: token } });
            if (data.success) {
                setchats(data.chats);
                if (data.chats.length === 0) {
                    await createchat();
                    return fetchuserchats();
                } else {
                    setSelectedChats(data.chats[0]);
                }
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    useEffect(() => {
        if (token) {
            fetchuser()
        } else {
            setuser(null);
            setLoadinguser(false)
        }
    }, [token])

    useEffect(() => {
        if (user) {
            fetchuserchats();
        }
        else {
            setchats([]);
            setSelectedChats();
        }
    }, [user])

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        }
        else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);

    }, [theme])

    const value = {
        navigate,
        user,
        setuser,
        fetchuser,
        chats,
        setchats,
        selectedChats,
        setSelectedChats,
        theme,
        setTheme,
        axios,
        fetchuserchats,
        createchat,
        token,
        setToken,
        loadinguser
    };
    return (
        <Appcontext.Provider value={value}>
            {children}
        </Appcontext.Provider>
    )
}
export const useAppcontext = () => useContext(Appcontext);