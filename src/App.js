import React from 'react';
import './App.css';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const storiesReducer = (state, action) => {
  switch(action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(story => (
          story.objectID !== action.payload.objectID
        ))
      };
    default:
      throw new Error();
  }
};

const App = () => {
  const [ searchTerm, setSearchTerm ] = React.useState('');
  const [ url, setUrl ] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );
  const [ stories, dispatchStories ] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    try {
      const result = await fetch(url).then(response => response.json());
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.hits
      });
    } catch {
      dispatchStories({
        type: 'STORIES_FETCH_FAILURE'
      })
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);
  
  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    });
  };
  
  return (
    <div>
      <h1>My Hacker Stories</h1>
      <SearchForm
        searchTerm={ searchTerm }
        onSearchInput={ handleSearchInput }
        onSearchSubmit={ handleSearchSubmit }
      />
      {
        stories.isError && <p>Something wen wrong...</p>
      }
      {
        stories.isLoading ? (
          <p>Loading...</p>
        ) : (
          <List 
            list={ stories.data } 
            onRemoveItem={ handleRemoveStory }  
          />
        )
      }
    </div> 
  );
}

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit
}) => {
  return (
    <form onSubmit={ onSearchSubmit }>
      <InputWithLabel
        id="search"
        value={ searchTerm }
        isFocused
        onInputChange={ onSearchInput }
      >
        <p>HelloEveryone</p>
        Search:&nbsp;
      </InputWithLabel>
      <button
        type="submit"
        disabled={ !searchTerm }
      >
        Submit
      </button>
    </form>
  );
};

const InputWithLabel = ({ 
  id, 
  value, 
  onInputChange,
  type= 'text',
  children,
  isFocused
}) => {
  const inputRef = React.useRef();
  
  React.useEffect(() => {
    if(isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <React.Fragment>
      <label htmlFor={ id }>{ children }</label>
      <input
        ref={ inputRef }
        id={ id }
        type={ type }
        value={ value }
        autoFocus={ isFocused }
        onChange={ onInputChange }
      />
    </React.Fragment>
  )
}

const List = ({ list, onRemoveItem }) => {
  return list.map(item => {
    return (
      <Item 
        key={ item.objectID } 
        item={ item } 
        onRemoveItem={ onRemoveItem }
      />
    );
  });
};

const Item = ({ 
  item, onRemoveItem
}) => {
  return (
    <div>
      <span>
        <a href={ item.url }>{ item.title }</a>
      </span>
      <span>{ item.author }</span>
      <span>{ item.num_comments }</span>
      <span>{ item.points }</span>
      <span>
        <button
          type="button"
          onClick={ () => onRemoveItem(item) }
        >Dismiss</button>
      </span>
    </div>
  );
};

export default App;
