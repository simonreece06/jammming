import { useState } from 'react';
import './App.css';
import Title from './components/Title/Title.jsx';
import SearchBar from './components/SearchBar/SearchBar.jsx';
import Songlist from './components/Songlist/Songlist.jsx';
import Button from './components/Button/Button.jsx';

let testData = [
    {
        id: 1,
        artist: "Justin Bieber",
        name: 'Sorry',
        length: 5
    },
    {
        id: 2,
        artist: "APC",
        name: 'The Noose',
        length: 4
    },
    {
        id: 3,
        artist: "Red",
        name: 'Faceless',
        length: 3.5
    },
];





function App() {
  return (
    <div>
      <Title />
      <SearchBar />
      <Button label="Search"></Button>

      <div className="results">
        <div className="song-table">
          <Songlist label="Results" songs={testData} />
          <Button label="Add track"></Button>
        </div>
        <div className="song-table" >
          <Songlist label="Playlist" songs={testData}/>
          <Button label="Add playlist"></Button>
        </div>

        
      </div>
      








    </div>

  )
}

export default App
