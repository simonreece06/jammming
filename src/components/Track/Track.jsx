import "./Track.css"
import Button from '../Button/Button.jsx';


const Track = ({ artist, name, length, album }) => {
    return (
        <div className="track">
            <div className="artist">
                <h3>{artist}</h3>
                <p>{name} | {album}</p>
            </div>
            <div className="song-length">
                <p>{length}</p>
                <Button className="song-add-button" label="+"/>
            </div>
  
        </div>
    )
}

export default Track;