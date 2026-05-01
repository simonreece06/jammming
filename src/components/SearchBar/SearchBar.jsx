import "./SearchBar.css";




const SearchBar = ({ value, onChange}) => {
    return (

            <input
              type="text"
              placeholder="test"
              value={value}
              onChange={onChange}
              
            />


    )
}



export default SearchBar;