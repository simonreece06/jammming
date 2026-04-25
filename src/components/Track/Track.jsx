import "./Track.css"
import Button from '../Button/Button.jsx';


const Track = ({ track }) => {
    return (
        <div className="track">
            <div className="artist">
                <h3>{track.artist}</h3>
                <p>{track.name} | {track.album}</p>
            </div>
            <div className="song-length">
                <p>{track.length}</p>
                <Button className="song-add-button" label="+"/>
            </div>
  
        </div>
    )
}

export default Track;