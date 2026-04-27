const clientID = "d4a76c88bc7c44969e8791474cc99fdc";
const redirectUri = "http://127.0.0.1:5173/";
const clientSecret = "76449834d8a74722aecdecc062b9bfb8";
const state = crypto.randomUUID()
localStorage.setItem("spotify_auth_state", state);

const logIn = () => {
    const params = new URLSearchParams({
    client_id: clientID,
    response_type: 'code',
    redirect_uri: redirectUri,
    state: state,
    scope: "user-read-email user-read-private playlist-read-private playlist-read-collaborative",
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


export { logIn, getToken };
