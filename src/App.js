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

  const handleChange = event => {
    console.log(event.target.value);
  };
  
  return (
    <div>
      <h1>My Hacker Stories</h1>
      <label htmlFor="search">Search: </label>
      <input
        type="text"
        id="search"
        onChange={ handleChange }
      />
      <List list={ stories } />
    </div> 
  );
}

const List = (props) => {
  return props.list.map(item => {
    return (
      <div key={ item.objectID }>
        <span>
          <a href={ item.url }>{ item.title }</a>
        </span>
        <span>{ item.author }</span>
        <span>{ item.num_comments }</span>
        <span>{ item.points }</span>
      </div>
    );
  })
};

export default App;
