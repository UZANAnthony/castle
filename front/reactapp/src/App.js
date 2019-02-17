import React, { Component } from 'react';

import './App.css';
import Table from './Tables';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Best Hotel Selection!</h1>
        <h2>Select a row to see details about restaurants.</h2>
        
        <Table />
          
      </div>
    );
  }
}

export default App;
