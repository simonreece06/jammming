import "./Track.css"


const Track = ({ artist, name, length }) => {
    return (
        <div className="track">
            <div className="artist">
                <h3>{artist}</h3>
                <p>{name}</p>
            </div>
            <div className="song-length">
                <p>{length}</p>
            </div>     
        </div>
    )
}

export default Track;