import React from 'react';
import './App.css';

const useSemiPersistentState = (key, initialState) => {
  const [ value, setValue ] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [ value, setValue ];
};

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org',
    author: 'Dan Abramov',
    num_comments: 2,
    points: 2,
    objectID: 1,
  },
  {
    title: 'Facebook',
    url: 'http://facebook.com',
    author: 'Mark',
    num_comments: 3,
    points: 5,
    objectID: 2,
  }
];

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

const getAsyncStories = () => {
  return new Promise((resolve, reject) => {
    setTimeout(reject, 1500)
  });
};

const App = () => {
  const [ searchTerm, setSearchTerm ] = React.useState('');
  const [ stories, dispatchStories ] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  React.useEffect(() => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    getAsyncStories()
      .then(result => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.data.stories
        });
      })
      .catch(() => dispatchStories({ type: 'STORIES_FETCH_FAILURE' }));
  }, []);

  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    });
  };

  const searchedStories = stories.data.filter(story => (
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  ));
  
  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel
        id="search"
        value={ searchTerm }
        onInputChange={ handleSearch }
        isFocused
      >
        <p>HelloEveryone</p>
        Search:&nbsp;
      </InputWithLabel>
      {
        stories.isError && <p>Something wen wrong...</p>
      }
      {
        stories.isLoading ? (
          <p>Loading...</p>
        ) : (
          <List 
            list={ searchedStories } 
            onRemoveItem={ handleRemoveStory }  
          />
        )
      }
    </div> 
  );
}

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
