import React, { Component } from 'react';
import data from '../Data/hotels.json'


class Grid2 extends Component {

    constructor(props){
        super(props);
        this.state = {
            info: data.map((item) => {
                return item
            })
        }
        this.compareBy.bind(this);
        this.sortBy.bind(this);
    }

    sendInfo = (item) => {
        this.props.info(item)
    }

    compareBy(key) {
        return function (a, b) {
          if (a[key] < b[key]) return -1;
          if (a[key] > b[key]) return 1;
          return 0;
        };
    }
     
    sortBy(key) {
        let arrayCopy = [...this.state.info];
        arrayCopy.sort(this.compareBy(key));
        this.setState({info: arrayCopy});
    }

    render() {
        const rows = this.state.info.map( (rowData) => {
            return(
            <tr>
                <td>{rowData.name}</td>
                <td>{rowData.city}</td>
                <td>{rowData.price}</td>
                <button type="button" class="btn btn-outline-primary"onClick={this.sendInfo.bind(this, rowData)}>...</button>
            </tr>
        )});

      return (

        <div className="table">
        <table class="table table-hover table-sm">
                <thead>
                    <tr>
                    <th onClick={() => this.sortBy('name')} scope="col">Name</th>
                    <th onClick={() => this.sortBy('city')} scope="col">City</th>
                    <th onClick={() => this.sortBy('price')} scope="col">Price</th>
                    <th scope="col">Info</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
      );
    }
  }
  
  export default Grid2;