import { useState } from 'react'




const SearchBar = () => {
    const [text, setText] = useState("");

    const changeText = (e) => {
        setText(e.target.value);
    }
    return (
        <div>
            <input
              type="text"
              placeholder="test"
              value={text}
              onChange={changeText}
              
            />

        </div>
    )
}



export default SearchBar;