import React, { Component } from 'react';
import data from '../Data/hotels2.json'

class Grid extends Component {

    constructor(){
        super();
        this.state = data.map((item) => {
            return item
        })
    }

    sendInfo = (item) => {
        this.props.info(item)
    }

    render() {
      return (
        <div>
            <table class="table table-hover table-sm">
                <thead>
                    <tr>
                    <th scope="col">Name</th>
                    <th scope="col">City</th>
                    <th scope="col">Price</th>
                    <th scope="col">Info</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.map((item) =>{
                        return(
                        <tr>
                            <td>{item.name}</td>
                            <td>{item.city}</td>
                            <td>{item.price}</td>
                            <button type="button" class="btn btn-outline-primary"onClick={this.sendInfo.bind(this, item)}>...</button>
                        </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
      );
    }
  }
  
  export default Grid;