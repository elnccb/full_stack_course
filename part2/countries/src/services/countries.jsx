import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const api_key = import.meta.env.VITE_API_KEY
const weatherUrl = (lat, lon) => `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getWeather = (lat, lon) => {
    const url = weatherUrl(lat, lon)
    const request = axios.get(weatherUrl(lat, lon))
    return request.then(response => response.data)
}

export default { getAll, getWeather }