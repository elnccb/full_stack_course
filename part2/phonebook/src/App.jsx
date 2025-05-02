import { useState, useEffect } from 'react'
import noteService from './services/persons'

const Notification = ({message, error}) => {
  if(message === null) {
    return null
  }

  const style = error ? {color: 'red'} : {color: 'green'}

  return (
    <div className='message' style={style}>
      {message}
    </div>
  )
}

const Filter = ({filter, onChange}) => {
  return (
    <div>
      filter shown with <input
        value={filter}
        onChange={onChange}
      />
    </div>
  )
}

const Form = ({addName, newName, newNumber, handleNameChange, handleNumberChange}) => {
  return(
    <form onSubmit={addName}>
        <div>
          name: <input 
            value={newName}
            onChange={handleNameChange} 
            />
        </div>
        <div>
          number: <input 
            value={newNumber}
            onChange={handleNumberChange} 
            />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons = ({filter, persons, deleteName}) => {
  filter = filter.toLowerCase()

  if(filter.length !== 0) {
    persons = persons.filter((person) => person.name.toLowerCase().includes(filter))
  }

  return(
    <>
      {persons.map((person) => 
        <div key={person.name}>{person.name} {person.number}
          <button onClick={() => deleteName(person)}>delete</button>
          </div>
      )}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(false)

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }
    const person = persons.find((person) => person.name === nameObject.name)

    if(person === undefined) {
      noteService
        .create(nameObject)
        .then((data) => {
          setPersons(persons.concat({...nameObject, id:data.id}))
          setNewName('')
          setNewNumber('')
          setMessage(`Added ${data.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(() => {
          setError(true)
          setMessage(data.error)
          setTimeout(() => {
            setMessage(null)
            setError(false)
          }, 5000)
        })
    } else {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        noteService
        .update(person.id, nameObject)
        .then(() => {
          setPersons(persons.map(entry => entry.id === person.id ? {...nameObject, id:person.id} : entry))
          setNewName('')
          setNewNumber('')
          setMessage(`Changed ${person.name}'s number`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(() => {
          setError(true)
          setMessage(`Information of ${person.name} has already been removed from server`)
          setTimeout(() => {
            setMessage(null)
            setError(false)
          }, 5000)
          setPersons(persons.filter(n => n.id !== person.id))
        })
      }
    }

    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const deleteName = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      noteService.
        eliminate(person.id)
        .then(() => {
          setPersons(persons.filter(entry => entry.id !== person.id))
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  useEffect(() => {
    noteService
      .getAll()
      .then(data => {
        setPersons(data)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} error={error}/>
      <Filter filter={filter} onChange={handleFilterChange}/>
      <h3>add a new</h3>
      <Form addName={addName} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h3>Numbers</h3>
      <Persons filter={filter} persons={persons} deleteName={deleteName}/>
    </div>
  )
}

export default App