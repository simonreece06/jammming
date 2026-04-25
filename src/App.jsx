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
        length: 5,
        album: "Sorry"
    },
    {
        id: 2,
        artist: "APC",
        name: 'The Noose',
        length: 4,
        album: "Thirteenth Step"
    },
    {
        id: 3,
        artist: "Red",
        name: 'Faceless',
        length: 3.5,
        album: 'The Faceless'
    },
    {
        id: 4,
        artist: "VERY LONG ARTIST NAME WHAT THE ...",
        name: 'VERY LONG NAME ON THE TRACK TOO ...',
        length: 3.5,
        album: 'WHAT WHY IS EVEYRTHING SO LONG'
    },

];





function App() {
  const [results, setResults] = useState(testData);
  const [playlistName, setPlaylistName] = useState("Your Playlist");
  const [currentPlaylist, setCurrentPlaylist] = useState([]);

  
  const namePlaylist = (e) => {
    setPlaylistName(e.target.value);
  }

  const addSong = (track) => {
    setCurrentPlaylist(prev => [...prev, track]);
  }




  return (
    <div>
      <Title />
      <SearchBar />
      <Button label="Search"></Button>

      <div className="results">
        <div className="song-table">
          <Songlist label="Results" songs={testData} addSong={addSong} />
        </div>
        <div className="song-table" >
          <div className="playlist-header">
            <h3 className="playlist-label">Playlist:</h3>
            
            <input
              className="playlist-name-input"
              value={playlistName}
              onChange={namePlaylist}
            />
          </div>
          <Songlist songs={currentPlaylist}/>
          <Button label="Add playlist"></Button>
        </div>

        
      </div>
      








    </div>

  )
}

export default App
