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
  }
];

const App = () => {
  const [ searchTerm, setSearchTerm ] = useSemiPersistentState(
    'search', 'React'
  );

  const [ stories, setStories ] = React.useState(initialStories);

  const handleSearch = event => {
    setSearchTerm(event.target.value);
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
      <List list={ searchedStories } />
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

const List = ({ list }) => {
  return list.map(item => {
    return (
      <Item key={ item.objectID } item={ item } />
    );
  });
};

const Item = ({ 
  item: {
    url,
    author,
    num_comments,
    points,
    title
  }
}) => {
  return (
    <div>
      <span>
        <a href={ url }>{ title }</a>
      </span>
      <span>{ author }</span>
      <span>{ num_comments }</span>
      <span>{ points }</span>
    </div>
  );
};

export default App;
