import { useState, useEffect } from 'react';
import './App.css';
import Title from './components/Title/Title.jsx';
import SearchBar from './components/SearchBar/SearchBar.jsx';
import Songlist from './components/Songlist/Songlist.jsx';
import Button from './components/Button/Button.jsx';
import { logIn, getToken, addPlaylistToSpotify, searchSpotify, selectedSongsURIs } from './services/Spotify.js';
import testData from './testData.js';

function App() {
  const [results, setResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("Your Playlist");
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [token, setToken] = useState(null);
  const [tokenExpiry, setTokenExpiry] = useState(null)
  const [query, setQuery] = useState("");
  const [hydrated, setHydrated] = useState(false);


  
  const namePlaylist = (e) => {
    setPlaylistName(e.target.value);  
  }

const addSong = (track) => {
  setCurrentPlaylist(prev => {
    if (prev.some(song => song.id === track.id)) return prev;
    const updated = [...prev, track];
    return updated;
  });
};

useEffect(() => {
  const raw = sessionStorage.getItem("playlist");
  if (raw) {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      setCurrentPlaylist(parsed);
    }
  }
  setHydrated(true);
},[]);
useEffect(() => {
  if (!hydrated) return;

  sessionStorage.setItem("playlist", JSON.stringify(currentPlaylist));
}, [currentPlaylist, hydrated]);


  const removeSong= (trackToRemove) => {
    setCurrentPlaylist(prev => {      
      const updated = prev.filter(song => song.id !== trackToRemove.id);
      sessionStorage.setItem("playlist", JSON.stringify(updated));
      return updated;
    })
  }

  useEffect(() => {    
    const fetchToken = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (!code) {
          return;
        }

        const obtainedToken = await getToken(code);
        if (!obtainedToken || !obtainedToken.access_token) {
          throw new Error("Failed to get access token");
        }
        setToken(obtainedToken.access_token);
        const expiry = Date.now() + obtainedToken.expires_in * 1000;
        setTokenExpiry(expiry);
        window.history.replaceState({}, document.title, "/");
        localStorage.setItem("token", obtainedToken.access_token);
        localStorage.setItem("expiry", expiry)
        } catch (err) {
          console.error("Token fetch failed:", err);
        }
 

 
      }
      
        
    fetchToken();    
  },[]);

  useEffect(() => {
    //this gets a token after getting auth code
    const localToken = localStorage.getItem("token");
    const localExpiry = localStorage.getItem("expiry");
    if (localToken) {
      setToken(localToken);
      setTokenExpiry(localExpiry);      
      return;
    }
  },[])


  useEffect(() => {
    //load old custom playlist
    const previousPlaylist = JSON.parse(sessionStorage.getItem("playlist"));
    if (Array.isArray(previousPlaylist)) {
      setCurrentPlaylist(previousPlaylist);
    }
  },[])

  const addPlaylist = () => {
    //first check if we need a new token
    if (tokenExpiry && Date.now() > tokenExpiry || !token) {
      logIn();
      return
    }
    //first we generate a list of URIs
    const uris = selectedSongsURIs(currentPlaylist);
    addPlaylistToSpotify(token, playlistName, uris);
    setPlaylistName("Start your next playlist...");
    setCurrentPlaylist([]);
  }

  const spotifyResults = async () => {
    if (!token) {
      logIn();
      return;
    }
    if (!query) {
      return;
    }
    if (tokenExpiry && Date.now() > tokenExpiry || !token) {
      logIn();
      return
    }
    const results = await searchSpotify(token, query);
    setResults(results);
  }

  const changeQuery = (e) => {
    setQuery(e.target.value);
    //console.log('succ'); 
  }

  useEffect(() => {
    if (!token) {
      return;
    }
    const theTimer = setTimeout(() => {
      spotifyResults();
    }, 500);
    return () => clearTimeout(theTimer);
  },[query]);

  //search button label
  const whichSearchLabel = () => {
    if (!token) {
      return "Login to Spotify";
    } else {
      return "Auto-search";
    }
  }

  const clearCurrentPlaylist = () => {
    setCurrentPlaylist([]);
    setPlaylistName("Start your next playlist");
  }

  const whichClearLabel = () => {
    if (currentPlaylist.length === 0) {
      return ""
    }
    else {
      return "Clear Playlist";
    }
  }

  return (
    <div>
      <Title />
      <div className="search-bar-container">
        <SearchBar value={query} onChange={changeQuery} />
        <Button className="search-bar-button" buttonLabel={whichSearchLabel()} onClick={spotifyResults}></Button>
      </div>


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
          <div className="button-container">
            <Button className="add-playlist-button" buttonLabel="Add playlist" onClick={addPlaylist}></Button><Button buttonLabel={whichClearLabel()} className="clear-button" onClick={clearCurrentPlaylist}></Button>
          </div>
          
        </div>

        
      </div>
      








    </div>

  )
}

export default App
