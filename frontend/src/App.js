import React, { Component } from 'react';
import './App.css';
import CreateList from './components/CreateList'
import ListGrid from './components/ListGrid'

class App extends Component {
  render() {
    return (
      <div className="App">
      <img className="img"src="biospective.png"/>
      <CreateList/>
      <ListGrid/>
      
      </div>
    );
  }
}

export default App;
