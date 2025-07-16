import { AppContext } from "./AppContext";
import axios from "axios";
import { useEffect, useState } from "react";
import {toast} from "react-hot-toast"
import { useNavigate } from "react-router-dom";


axios.defaults.baseURL=import.meta.env.VITE_BASE_URL

export const AppProvider = ({ children }) => {
    const navigate=useNavigate()
    const currency=import.meta.env.VITE_CURRENCY

    const [token, setToken]=useState(null)
    const [user, setUser]=useState(null)
    const [isOwner, setIsOwner]=useState(false)
    const [showLogin, setShowLogin]=useState(false)
    const [pickupDate, setPickupDate]=useState('')
    const [returnDate, setReturnDate]=useState('')

    const [cars, setCars]=useState([])

    // Function t checked if user is loggedIn
    const fetchUser=async ()=>{
        try {
           const {data}= await axios.get('/api/user/data')
           if(data.success){
            setUser(data.user)
            setIsOwner(data.user.role==='owner')
           }else{
            navigate('/')
           }
        } catch (error) {
            toast.error(error.message)
        }
    }
    // function to fetch all car from the server
    const fetchCars=async ()=>{
        try {
            const {data}=await axios.get('/api/user/cars')
            data.success ? setCars(data.cars):toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to log out the user
    const logout=async()=>{
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        setIsOwner(false)
        axios.defaults.headers.common['Authorization']=''
        toast.success("You have been logged out")
    }


    // use effect to retrieve the token from localStorage
    useEffect(()=>{
        const token=localStorage.getItem("token")
        setToken(token)
        fetchCars()
    },[])

    // use effect to fetch user datawhen token is available
   useEffect(()=>{
    if(token){
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        fetchUser()
    }
   },[token])


    const value = {
        navigate, currency, axios, user, setUser, token, setToken, 
        isOwner, setIsOwner, fetchUser, showLogin, setShowLogin, 
        logout, fetchCars, cars, setCars, pickupDate, setPickupDate, 
        returnDate, setReturnDate

    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
