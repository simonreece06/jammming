import './Songlist.css';
import Track from '../Track/Track.jsx'






const Songlist = ({ label, songs}) => {
    return (

    <div className="song-list">
      <h3>{label}</h3>
      {songs.map(song => (
    <div key={song.id}>
        <Track artist={song.artist} name={song.name} length={song.length} album={song.album}/>
    </div>
    ))}
    </div>


    )
}

export default Songlist;