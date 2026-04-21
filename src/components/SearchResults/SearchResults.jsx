import './SearchResults.css';



let testData = [1, 2, 3, 4, 5];






const SearchResults = () => {
    return (
    <div className="search-results">
      {testData.map(item => (
    <div key={item.id}>
        {item}
    </div>
    ))}
    </div>


    )
}

export default SearchResults;