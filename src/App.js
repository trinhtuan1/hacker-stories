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

const getAsyncStories = () => {
  return new Promise(resolve => {
    setTimeout(() => resolve({ data: { stories: initialStories } }), 1500);
  });
};

const App = () => {
  const [ searchTerm, setSearchTerm ] = React.useState('');
  const [ stories, setStories ] = React.useState([]);
  const [ isLoading, setIsLoading ] = React.useState(false);
  const [ isError, setIsError ] = React.useState(false);

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  React.useEffect(() => {
    setIsLoading(true);
    getAsyncStories().then(result => {
      setStories(result.data.stories);
      setIsLoading(false);
    });
  }, []);

  const handleRemoveStory = item => {
    const newStories = stories.filter(story => (
      story.objectID !== item.objectID
    ));
    setStories(newStories);
  };

  const searchedStories = stories.filter(story => (
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
        isError && <p>Something wen wrong...</p>
      }
      {
        isLoading ? (
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
