import './Songlist.css';
import Track from '../Track/Track.jsx';
import testData from '../../testData.js';







const Songlist = ({ tableLabel, songs, actionSong, buttonLabel, results, playlist }) => {
    


    return (

    <div className="song-list">
      <h3>{tableLabel}</h3>
      {songs.map(song => (
    <div key={song.id}>
        <Track track={song} actionSong={actionSong} buttonLabel={buttonLabel} results={results} playlist={playlist}/>
    </div>
    ))}
    </div>


    )
}

export default Songlist;