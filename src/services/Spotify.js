const clientID = "d4a76c88bc7c44969e8791474cc99fdc";
const redirectUri = "https://jammmingsr.netlify.app";
const clientSecret = "CHECK SPOTIFY DASHBOARD FOR THIS";
const state = crypto.randomUUID()
localStorage.setItem("spotify_auth_state", state);

import testData from '../testData.js';

const logIn = () => {
    const params = new URLSearchParams({
    client_id: clientID,
    response_type: 'code',
    redirect_uri: redirectUri,
    state: state,
    scope: "user-read-email user-read-private playlist-read-private playlist-read-collaborative playlist-modify-private",
    })

    let authURL = "https://accounts.spotify.com/authorize?" + params.toString();

    window.location.href = authURL;
    

}



const getToken = async (code) => {
    const tokenEndpoint = 'https://accounts.spotify.com/api/token';
    const responseToken = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
            'content-type': "application/x-www-form-urlencoded",
            'Authorization': 'Basic ' + btoa(`${clientID}:${clientSecret}`)
        },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: redirectUri
        })
    })    
    const data = await responseToken.json();

    if (!responseToken.ok) {
        throw new Error(data.error_description || "Token request failed");
        
    }
    console.log(`my token is ${data.access_token}`);
    
    return data;
    
}

//function to turn selected tracks into array of uris

const selectedSongsURIs = (songs) => {
    //console.log(songs);
    const uris = songs.map(song => song.uri);
    //console.log(uris);
    return uris;
}

const addPlaylistToSpotify = async (authCode, playlistName, songs) => {   
    //first we need to create an empty playlist
    const endPoint = 'https://api.spotify.com/v1/me/playlists';
    const responseToken = await fetch(endPoint, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${authCode}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'name': playlistName,
            'description': 'testing',
            'public': false
        })
    })

    const data = await responseToken.json();

    if (!responseToken.ok) {
        throw new Error(data.error_description ||"Token request for creating original playlist failed");
    }

    //console.log("success");
    //return data;
    //now we add to this playlist
    const playlistId = data.id;

    const secondEndPoint = `https://api.spotify.com/v1/playlists/${playlistId}/items`;
    const secondResponseToken = await fetch(secondEndPoint, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${authCode}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            position: 0,
            uris:songs
        })
    })

    const secondData = await secondResponseToken.json();
    return secondData;
    //console.log(songs);
    

}

const searchSpotify = async (token, query) => {
    try {
        const params = new URLSearchParams({
            q: query,
            type: "track",
            limit: 5
        })    
            const endPoint = `https://api.spotify.com/v1/search?${params.toString()}`;
            const responseToken = await fetch(endPoint, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
        }
        })

        const data = await responseToken.json();

        if (!responseToken.ok) {
        throw new Error(data.error_description || "Search Failed");
        }
        //console.log("search success");
        //console.log([data.tracks.items[0].name, data.tracks.items[1].name]);
        const formattedResults = data.tracks.items.map(song => {        
            return {
                id: song.id,
                artist: song.artists?.[0]?.name,
                name: song.name,
                length: `${Math.floor(song.duration_ms / 60000)}:${Math.floor((song.duration_ms % 60000) / 1000).toString().padStart(2, "0")}`,
                album: song.album?.name,
                uri: song.uri
                
            }
    })
        //console.log(formattedResults);
        //console.log(testData)

        return formattedResults;
    }

    catch (error) {
        console.error("GET Error", error);
        throw error;
    }
    }
    






export { logIn, getToken, addPlaylistToSpotify, searchSpotify, selectedSongsURIs };
