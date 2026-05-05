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
  const [token, setToken] = useState(() => {
    const oldToken = localStorage.getItem("token");
    if (oldToken) {
      return oldToken;
    } else {
      return null;
    }
  });
  const [tokenExpiry, setTokenExpiry] = useState(null)
  const [query, setQuery] = useState(() => {
    const oldQuery = sessionStorage.getItem("query");
    if (oldQuery) {
      console.log(`first sessionStorage is ${oldQuery}`);
      return oldQuery;
    } else {
      return "";
    }
  });
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState("asd");

  //run search if query is not empty, on a refresh

  
  
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

        localStorage.setItem("token", obtainedToken.access_token);
        localStorage.setItem("expiry", expiry)
        } catch (err) {
          console.error("Token fetch failed:", err);
        }
 

 
      }
      
        
    fetchToken();    
  },[]);

  useEffect(() => {
    if (!token) {
      return;
    }
     window.history.replaceState({}, document.title, "/");
  },[token]);

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
    if (currentPlaylist.length === 0) {
      alert("Add at least one song to create a playlist.");
      return;
    }
    const uris = selectedSongsURIs(currentPlaylist);
    addPlaylistToSpotify(token, playlistName, uris);
    setToast("Playlist added!");
    setTimeout(() => setToast(""), 3000);
    setPlaylistName("Start your next playlist...");
    setCurrentPlaylist([]);
  }



  const spotifyResults = async () => {
    if (!token) {
      console.log("1");
      sessionStorage.setItem("query", query);
      const testValue = sessionStorage.getItem("query");
      console.log(`session Storage is ${testValue}`);
      logIn();
      console.log(`session Storage is ${testValue}`);
      return;
    }
    if (!query) {
      console.log("2");
      return;
    }
    if (tokenExpiry && Date.now() > tokenExpiry || !token) {
      console.log("3");
      logIn();
      return
    }
    const results = await searchSpotify(token, query);
    setResults(results);
  }

  const changeQuery = (e) => {
    setQuery(e.target.value);
    sessionStorage.setItem("query", e.target.value);
    //console.log('succ'); 
  }

  useEffect(() => {
    if (!token) {
      return;
    }
    if (!query) {
      return
    }

    const theTimer = setTimeout(() => {
      spotifyResults();
    }, 500);
    return () => clearTimeout(theTimer);
  },[token, query]);
  

  //search button label
  const whichSearchLabel = () => {
    if (!token || tokenExpiry && Date.now() > tokenExpiry ) {
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

  const disabledAddPlaylist = () => {
    if (!token || tokenExpiry && Date.now() > tokenExpiry){
      return true;
    } else {
      return false;
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
            <Button className="add-playlist-button"  buttonLabel="Add playlist" disabled={disabledAddPlaylist()} onClick={addPlaylist}></Button><Button buttonLabel={whichClearLabel()} className="clear-button" onClick={clearCurrentPlaylist}></Button>
          </div>
          {toast && <div className="toast">{toast}</div>}
          
        </div>

        
      </div>
      








    </div>

  )
}

export default App
