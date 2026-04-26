import './Songlist.css';
import Track from '../Track/Track.jsx'






const Songlist = ({ tableLabel, songs, actionSong, buttonLabel}) => {
    return (

    <div className="song-list">
      <h3>{tableLabel}</h3>
      {songs.map(song => (
    <div key={song.id}>
        <Track track={song} actionSong={actionSong} buttonLabel={buttonLabel}/>
    </div>
    ))}
    </div>


    )
}

export default Songlist;