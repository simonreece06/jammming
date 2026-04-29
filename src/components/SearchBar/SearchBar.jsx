import { useState } from 'react'




const SearchBar = ({ value, onChange}) => {
    return (
        <div>
            <input
              type="text"
              placeholder="test"
              value={value}
              onChange={onChange}
              
            />

        </div>
    )
}



export default SearchBar;