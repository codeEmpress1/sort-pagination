import React, { useCallback, useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import List from './components/List';
import SearchForm from './components/SearchForm';



const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState
  );

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload.hits,
        totalPages: action.payload.nbPages,
        currentPage: action.payload.page
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};


const App = () => {
  
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );
  const [sortState, setSortState] = useState(null);
  const [curPage, setCurPage] = useState(0);
  const [urls, setUrls] = useState(
    [`${API_ENDPOINT}${searchTerm}&page=${curPage}`]
  );

  const [stories, dispatchStories] = useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  const [reverse, setReverse] = useState(false);

  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
  
      const result = await axios.get(urls[urls.length - 1]);
      console.log({result})
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data,
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [urls]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  const handleSearchInput = event => {
    if(searchTerm !== event.target.value){
      setCurPage(0);
    } 
    setSearchTerm(event.target.tagName === 'INPUT' ? event.target.value : event.target.textContent);
  };
  
  const handleSearchSubmit = event => {
    event.preventDefault();
    const sliceIndex = urls.length == 5 ? 1 : 0; 
    setUrls(Array.from(new Set(urls.slice(sliceIndex).concat(`${API_ENDPOINT}${searchTerm}&page=${curPage}`))));
  };

  const handleNextPage = (event) => {
    setCurPage(curPage + 1);
    handleSearchSubmit(event);
  }
  const handlePreviousPage = (event) => {
    
    if(urls.length > 1){
      setCurPage(curPage - 1);
      urls.pop()
    }
    handleSearchSubmit(event);
  }
  const handleReverse = () => {
      setReverse(!reverse)
  }
  

  return (
    <div>
      <h1>My Hacker Stories</h1> 

      <h3>Sort</h3> <br />
      <label for="sort">Sort By</label> <br />
      
        <select name="sort" id="lang" onChange={(e)=> setSortState(e.target.value)}>
          <option value="def">select...</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="points">Points</option>
          <option value="num_comments">Num Comments</option>
      </select> <br /> <br />
      <button onDoubleClick={handleReverse}>Reverse</button> <br />
      { 
        urls.slice(0, urls.length - 1).map(el => { 
          
          return <button onClick={
            (e) => {
              handleSearchInput(e);
            }
        }
        >
          {el.split("=")[1].split("&")[0]}</button>
        })
      }

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <hr />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <>
        <h2>Page: {curPage + 1} of ...</h2>
          <List list={stories.data} onRemoveItem={handleRemoveStory} sortBy={sortState} reverse={reverse} />
          <button onClick={(event) => handleNextPage(event)}>Next Page</button>
          <button onClick={(event) => handlePreviousPage(event)}>Previous Page</button>
        </>
      )}
    </div>
  );
};

export default App;

