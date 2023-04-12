import { defineStore } from "pinia";
import axios from 'axios'

export const useGoogleApi = defineStore("googleApi", () => {
const getGoogleApiData = async () => {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?types=country&input=A&key=${import.meta.env.VITE_GOOGLE_API_KEY}`)
        const data = await response.data
        console.log(data, 'google')
    }
    return {
        getGoogleApiData
    };
})