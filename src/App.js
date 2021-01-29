import React from 'react';
import './App.css';

const App = () => {
  const stories = [
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

  const [ searchTerm, setSearchTerm ] = React.useState(
    localStorage.getItem('search') || 'React'
  );

  const handleSearch = event => {
    setSearchTerm(event.target.value);
    localStorage.setItem('search', event.target.value);
  };

  const searchedStories = stories.filter(story => (
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  ));
  
  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search 
        search={ searchTerm } 
        onSearch={ handleSearch } 
      /> 
      <List list={ searchedStories } />
    </div> 
  );
}

const Search = ({ search, onSearch }) => {
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input 
        type="text"
        id="search"
        value={ search }
        onChange={ onSearch }
      />
    </div>
  );

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
