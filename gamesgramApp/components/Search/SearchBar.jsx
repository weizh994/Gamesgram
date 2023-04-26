import { useEffect, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import styles from '@/styles/Search.module.css';

export default function SearchBar(props){
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        if (typeof searchTerm !== '') {
          const endpoint =`/api/search/${searchTerm}`;
          const options = {
            // The method is POST because we are sending data.
            method: 'GET',
            // Tell the server we're sending JSON.
            headers: {
              'Content-Type': 'application/json',
            },};
          const response = await fetch(endpoint, options);
          if(response.status===200)
          {
            const data = await response.json();
            setSearchResults(data[0]);
          }
        } else {
          //setSearchResults([]);
        }
      };
  
      fetchData();
    }, [searchTerm]);

    useEffect(()=>{
      props.onSearch(searchResults);
    },[searchResults]);
    
    return (
        <div className={styles.searchContainer}>
          <DebounceInput
            minLength={2}
            debounceTimeout={300}
            type="text"
            placeholder="Search..."
            className={styles.searchInput}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      );
}