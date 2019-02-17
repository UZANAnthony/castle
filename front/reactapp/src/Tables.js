/* eslint-disable no-console */

import React from 'react';
import data from './hotelsv5.json';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, Column, SortDirection, Table } from 'react-virtualized';

const styles = theme => ({
  table: {
    fontFamily: theme.typography.fontFamily,
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: 'initial',
  },
});

class MuiVirtualizedTable extends React.PureComponent {
  getRowClassName = ({ index }) => {
    const { classes, rowClassName, onRowClick } = this.props;

    return classNames(classes.tableRow, classes.flexContainer, rowClassName, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer = ({ cellData, columnIndex = null }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={classNames(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
      >
        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({ label, columnIndex, dataKey, sortBy, sortDirection }) => {
    const { headerHeight, columns, classes, sort } = this.props;
    const direction = {
      [SortDirection.ASC]: 'asc',
      [SortDirection.DESC]: 'desc',
    };

    const inner =
      !columns[columnIndex].disableSort && sort != null ? (
        <TableSortLabel active={dataKey === sortBy} direction={direction[sortDirection]}>
          {label}
        </TableSortLabel>
      ) : (
        label
      );

    return (
      <TableCell
        component="div"
        className={classNames(classes.tableCell, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? 'right' : 'left'}
      >
        {inner}
      </TableCell>
    );
  };

  render() {
    const { classes, columns, ...tableProps } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            className={classes.table}
            height={height}
            width={width}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ cellContentRenderer = null, className, dataKey, ...other }, index) => {
              let renderer;
              if (cellContentRenderer != null) {
                renderer = cellRendererProps =>
                  this.cellRenderer({
                    cellData: cellContentRenderer(cellRendererProps),
                    columnIndex: index,
                  });
              } else {
                renderer = this.cellRenderer;
              }

              return (
                <Column
                  key={dataKey}
                  headerRenderer={headerProps =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classNames(classes.flexContainer, className)}
                  cellRenderer={renderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

MuiVirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      cellContentRenderer: PropTypes.func,
      dataKey: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
    }),
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowClassName: PropTypes.string,
  rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  sort: PropTypes.func,
};

MuiVirtualizedTable.defaultProps = {
  headerHeight: 56,
  rowHeight: 56,
};

const WrappedVirtualizedTable = withStyles(styles)(MuiVirtualizedTable);


let id = 0;
function createData(name, city, price, nb_rest) {
  id += 1;
  return { id, name, city, nb_rest, price };
}

const rows = [];
const info = [];

data.map(function(row){
    let nb_rest = 0
    if(row.rest[1].name == null){
        nb_rest = 1
    }
    else{
        nb_rest = 2
    }
    rows.push(createData(row.name, row.city, row.price, nb_rest))
    info.push(row)
    return 0
})


function ReactVirtualizedTable() {
  return (
    <Paper style={{ height: 500, width: '100%' }}>
      <WrappedVirtualizedTable
        rowCount={rows.length}
        rowGetter={({ index }) => rows[index]}
        //onRowClick={event => alert(JSON.stringify(info[event.index]))}
        onRowClick={function(event){
            /*let name = info[event.index].name
            let city = info[event.index].city
            let price = info[event.index].price
            let citation = info[event.index].citation
            let desc = info[event.index].desc*/

            let message = ''

            if(info[event.index].rest[1].name == null){
                if(info[event.index].rest[0].star != null){
                    message = 'Restaurant: ' + info[event.index].rest[0].name + '\nMichelin stars: ' + info[event.index].rest[0].star
                }
                else{
                    message = 'Restaurant: ' + info[event.index].rest[0].name + '\nNo recognizes by Michelin.'
                }
            }
            else{
                if(info[event.index].rest[0].star != null && info[event.index].rest[1].star == null){
                    message = 'Restaurant 1: ' + info[event.index].rest[0].name + '\nMichelin stars: ' + info[event.index].rest[0].star + '\n\nRestaurant 2: ' + info[event.index].rest[1].name + '\nNo recognizes by Michelin.'
                }
                else if(info[event.index].rest[0].star == null && info[event.index].rest[1].star != null){
                    message = 'Restaurant 1: ' + info[event.index].rest[0].name + '\nNo recognizes by Michelin.\n\nRestaurant 2:' + info[event.index].rest[1].name + '\nMichelin stars: ' + info[event.index].rest[1].star
                }
                else if(info[event.index].rest[0].star != null && info[event.index].rest[1].star != null){
                    message = 'Restaurant 1: ' + info[event.index].rest[0].name + '\nMichelin stars: ' + info[event.index].rest[0].star + '\n\nRestaurant 2: ' + info[event.index].rest[1].name + '\nMichelin stars: ' + info[event.index].rest[1].star
                }
                else{
                    message = 'Restaurant 1: ' + info[event.index].rest[0].name + '\nNo recognizes by Michelin.\n\nRestaurant 2: ' + info[event.index].rest[1].name + '\nNo recognizes by Michelin.'
                }
            }
            
            alert(message)
        }}
        columns={[
          {
            width: 50,
            flexGrow: 1.0,
            label: 'Name',
            dataKey: 'name',
          },
          {
            width: 300,
            label: 'City',
            dataKey: 'city',
          },
          {
            width: 200,
            label: 'Nb. Rest',
            dataKey: 'nb_rest',
            numeric: true,
          },
          {
            width: 200,
            label: 'Price',
            dataKey: 'price',
            numeric: true,
          },
        ]}
      />
    </Paper>
    
  );
}

export default ReactVirtualizedTable;