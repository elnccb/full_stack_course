import { useState, useEffect } from 'react'
import dataService from './services/countries'

const Display = ({country}) => {
  return (
    <>
      <h1>{country.name}</h1>
      <div>Capital {country.capital ? country.capital : "N/A"}</div>
      <div>Area {country.area}</div>
      <h2>Languages</h2>
        <ul>
          {country.languages ? country.languages.map((n) => <li key={n}>{n}</li>) : <li>None</li>}
        </ul>
      <img src={country.flag.png} alt={country.flag.alt} />
      {country.temp && country.capital ?
        <>
          <h2>Weather in {country.capital}</h2>
          <div>Temperature {country.temp} Celsius</div>
          <img src={`https://openweathermap.org/img/wn/${country.icon.img}@2x.png`} alt={country.icon.alt}/>
          <div>Wind {country.wind} m/s</div>
        </>
        :
        null
      }
    </>
  )
}

const Results = ({search, countries, shown, handleShow}) => {
  if (search === '' || countries.length === 0) {
    return null
  }

  search = search.toLowerCase();
  const displayedCountries = countries.filter((n) => n.name.toLowerCase().includes(search))

  if (shown !== null) {
    return (
      <Display country={shown}/>
    )
  } else if (displayedCountries.length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  } else if ((displayedCountries.length === 1)) {
      handleShow(displayedCountries[0])
  } else {
    return (
      <>
        {displayedCountries.map((n, index) => {
          return(
            <div key={index}>{n.name} 
              <button onClick={() => handleShow(n)}>Show</button>
            </div> 
          )
        })}  
      </>
    )
  }
}

function App() {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [shown, setShown] = useState(null)

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setShown(null)
  }

  const handleShow = (country) => {
    setShown(country)

    if (country.capital) {
      dataService
        .getWeather(country.latlng[0], country.latlng[1])
        .then((data) => {
          const weather = {
            ...country,
            temp: data.main.temp,
            wind: data.wind.speed,
            icon: {
              img: data.weather[0].icon,
              alt: data.weather[0].description
            }
          }
          setShown(weather)
        })
    }
  }
  
  useEffect(() => {
    dataService
      .getAll()
      .then((data) => {
        const storedData = data.map((n) => {
          return (
            {
              area: n.area,
              capital: n.capital,
              flag: n.flags,
              languages: n.languages ? Object.values(n.languages) : null, 
              name: n.name.common,
              latlng: n.capitalInfo.latlng
            })
        })
        setCountries(storedData)
      })
  }, [])

  return (
    <>
      <div>
        find countries <input value={search} onChange={handleSearchChange} />
      </div>
      <Results search={search} countries={countries} shown={shown} handleShow={handleShow}/>
    </>
  )
}

export default App
