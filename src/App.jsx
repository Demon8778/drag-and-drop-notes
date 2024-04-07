import { useState } from 'react'
import './App.css'
import Notes from './components/Notes'

const initialNotes = [
  {
    id: 1,
    text: 'Note 1',
  },
  {
    id: 2,
    text: 'Note 2',
  }
]
function App() {
  const [notes, setNotes] = useState(initialNotes)

  return (
    <div>
      <Notes notes={notes} setNotes={setNotes}/>
    </div>
  )
}

export default App
