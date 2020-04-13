import React from 'react';
import './Players.css'
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

function Players(props) {
  const classes = useStyles();
  const kickPlayer = (name) => {
    props.kickPlayer(name);
  }
  return (<TableContainer component={Paper}>
    <h1>Players</h1>
    <Table className={classes.table} aria-label="simple table">
      <TableHead>
      <TableRow>
        <TableCell><b>Player</b></TableCell>
        <TableCell align="right"><b>ID</b></TableCell>
      </TableRow>
      </TableHead>
      <TableBody>
        {
          props.players.map((player) => (<TableRow key={player.id}>
            <TableCell component="th" scope="row">{player.name}</TableCell>
            <TableCell align="right">{player.id}</TableCell>
            <TableCell align="right"><Button id="outlined-basic-name" className="margButt" variant="contained" color="primary" onClick={kickPlayer.bind(this, player.name)}>Kick player</Button></TableCell>
          </TableRow>))
        }
      </TableBody>
    </Table>
  </TableContainer>);
}

export default Players;
