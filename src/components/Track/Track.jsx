import "./Track.css"
import Button from '../Button/Button.jsx';


const Track = ({ track, actionSong, buttonLabel,  results, playlist}) => {

    const visibility = () => {
        const check =  (playlist ?? []).some(song => song.id === track.id);
        if (check && buttonLabel ==='+') {
            return true;
        }
        return false;
    };


    
    const onClick = () => {
        actionSong(track);

    }
    return (
        <div className="track">
            <div className="artist">
                <h3>{track.name}</h3>+
                <p>{track.artist} | {track.album}</p>
            </div>
            <div className="song-length">
                <p>{track.length}</p>

                <Button className="song-add-button" buttonLabel={buttonLabel} onClick={onClick} disabled={visibility()}/>
                

                
            </div>
  
        </div>
    )
}

export default Track;