import React from 'react';
import './Rooms.css'
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

function Rooms(props) {
  const classes = useStyles();
  const joinRoom = (roomId) => {
    props.joinRoom(roomId);
  }
  return (
    <TableContainer>
    <h1>Rooms</h1>
    <Table className={classes.table} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell><b>Room id</b></TableCell>
          <TableCell align="right"><b>Number of players</b></TableCell>
          <TableCell align="right"><b>Players</b></TableCell>
          <TableCell align="right"><b>Last Activity</b></TableCell>
          <TableCell align="right"><b>Team 1 Score</b></TableCell>
          <TableCell align="right"><b>Team 2 Score</b></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          props.rooms.map((room) => (<TableRow key={room.id}>
            <TableCell component="th" scope="row">{room.id}</TableCell>
            <TableCell align="right">{room.numberOfPlayer}</TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right">{new Date(room.lastActivity).toDateString()}</TableCell>
            <TableCell align="right">{room.scoreFirstTeam}</TableCell>
            <TableCell align="right">{room.scoreSecondTeam}</TableCell>
            <TableCell align="right"><Button id="outlined-basic-name" className="margButt" variant="contained" color="primary" onClick={joinRoom.bind(this, room.id)}>Join room</Button></TableCell>
          </TableRow>))
        }
      </TableBody>
    </Table>
  </TableContainer>);
}

export default Rooms;
