import React, { Component } from 'react';
import './App.css';
import CreateList from './components/CreateList'
import ListGrid from './components/ListGrid'

class App extends Component {
  render() {
    return (
      <div className="App">
      <CreateList/>
      <ListGrid/>
      
      </div>
    );
  }
}

export default App;
