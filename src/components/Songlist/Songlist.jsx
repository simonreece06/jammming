import './Songlist.css';
import Track from '../Track/Track.jsx'






const Songlist = ({ label, songs, addSong}) => {
    return (

    <div className="song-list">
      <h3>{label}</h3>
      {songs.map(song => (
    <div key={song.id}>
        <Track track={song} addSong = {addSong}/>
    </div>
    ))}
    </div>


    )
}

export default Songlist;