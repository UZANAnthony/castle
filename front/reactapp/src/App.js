import React, { Component } from 'react';
import Gridperso from './Components/Grid';
import Card from './Components/Card';
import Grid from '@material-ui/core/Grid';
import './App.css';



class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      child: null,
      vide: true
    }
  }

  myCallback = (dataFromChild) => {
    this.setState({child: dataFromChild, vide: false})
    console.log(dataFromChild)
    //console.log(this.state.child)
  }

  render() {
    if(this.state.vide){
      return(
        <div>
          <div className="title">
           <h1>Choose your hotel!</h1>
         </div>
        <div className="container body">
         <Grid container spacing={24}>
          <Grid item xs={6}>
            <Gridperso info={this.myCallback}/>  
          </Grid>
          <Grid item xs={6}>
          <div class="alert alert-primary" role="alert">
              Click on Hotel info's button!
          </div>
          </Grid>
         </Grid>
        </div>
      </div>
      )
    }
    else{
      return(
        <div>
          <div className="title">
           <h1>Choose your hotel!</h1>
         </div>
        <div className="container body">
         <Grid container spacing={24}>
          <Grid item xs={6}>
            <Gridperso info={this.myCallback}/>  
          </Grid>
          <Grid item xs={6}>
          <Card item={this.state.child}/>
          </Grid>
         </Grid>
        </div>
      </div>
      )
    }
  }
}

export default App;
