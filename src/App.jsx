import { useState, useEffect } from 'react';
import './App.css';
import Title from './components/Title/Title.jsx';
import SearchBar from './components/SearchBar/SearchBar.jsx';
import Songlist from './components/Songlist/Songlist.jsx';
import Button from './components/Button/Button.jsx';
import { logIn, getToken, addPlaylistToSpotify, searchSpotify } from './services/Spotify.js';
import testData from './testData.js';

function App() {
  const [results, setResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("statePlaylist Name");
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [token, setToken] = useState(null);
  const [tokenExpiry, setTokenExpiry] = useState(null)
  const [query, setQuery] = useState("");
  
  const namePlaylist = (e) => {
    setPlaylistName(e.target.value);  }

  const addSong = (track) => {
    if (currentPlaylist.some(song => song.id === track))
    setCurrentPlaylist(prev => [...prev, track]);
    
  }

  const removeSong= (trackToRemove) => {
    setCurrentPlaylist(prev => 
      prev.filter(track => track.id !== trackToRemove.id)
    );
  }

  useEffect(() => {
    const fetchToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (!code) {
        return;
      }
      if (token) {
        return;
      }
      const obtainedToken = await getToken(code);
      setToken(obtainedToken.access_token);
      setTokenExpiry(Date.now() + obtainedToken.expires_in * 1000);
      window.history.replaceState({}, document.title, "/");
    }
    fetchToken();
  },[token]);

  useEffect(() => {
    if (!token) {
      return;
    }
    const pendingPlaylist = localStorage.getItem("pendingPlaylist");
    if (pendingPlaylist) {
      
      addPlaylistToSpotify(token, pendingPlaylist);
      localStorage.removeItem("pendingPlaylist");

    }

  }, [token])
  





  const addPlaylist = () => {
    //first check if we need a new token
    if (tokenExpiry && Date.now() > tokenExpiry) {
      logIn();
      localStorage.setItem("pendingPlaylist", playlistName);
      return
    }
    if (!token) {
      logIn();
      localStorage.setItem("pendingPlaylist", playlistName);
      return;
    }
    addPlaylistToSpotify(token, playlistName);
  }

  const spotifyResults = async () => {
    if (!query) {
      return;
    }

    if (query && !token) {
      logIn();
      return;
    }
    const results = await searchSpotify(token, query);
    setResults(results);

  }

  const changeQuery = (e) => {
    setQuery(e.target.value);
    console.log('succ'); 
  }

  useEffect(() => {
    if (!query || !token){
      return;
    }
    const theTimer = setTimeout(() => {
      spotifyResults();
    },400);

    return () => clearTimeout(theTimer);

  },[query]);



  




  return (
    <div>
      <Title />
      <SearchBar value="test" value={query} onChange={changeQuery} />
      <Button buttonLabel="Search" onClick={spotifyResults}></Button>

      <div className="results">
        <div className="song-table">
          <Songlist tableLabel="Results" songs={results} results={results} playlist={currentPlaylist} actionSong={addSong} buttonLabel="+"/>
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
          <Songlist songs={currentPlaylist} results={results} playlist={currentPlaylist} actionSong={removeSong} buttonLabel="-"/>
          <Button buttonLabel="Add playlist" onClick={addPlaylist}></Button>
        </div>

        
      </div>
      








    </div>

  )
}

export default App
