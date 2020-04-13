import React from 'react';
import './Rooms.css'
import PlayerAvatar from "../Player/PlayerAvatar";
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
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
  const rooms = props.rooms;
  const joinRoom = (roomId) => {
    props.joinRoom(roomId);
  }
  return (<div>
    <h1>Rooms</h1>
    <div class='rooms'>
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Room id</b>
              </TableCell>
              <TableCell align="left">
                <b>Last Activity</b>
              </TableCell>
              <TableCell align="left">
                <b>Score</b>
              </TableCell>
              <TableCell align="left">
                <b>Players</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              rooms.map((room) => (<TableRow key={room.id}>
                <TableCell component="th" scope="row">
                  <b>{room.id}</b>
                </TableCell>
                <TableCell align="left">{new Date(room.lastActivity).toDateString()}</TableCell>
                <TableCell align="left">{room.scoreFirstTeam}
                  - {room.scoreSecondTeam}</TableCell>
                <TableCell align="left">
                  <div>
                    {
                      room.players.map((player) => (<div class='avatar'>
                        <PlayerAvatar player={player} gameMaster={room.gameMaster}/>
                      </div>))
                    }
                  </div>
                </TableCell>
                <TableCell align="left">
                  <Button id="outlined-basic-name" className="margButt" variant="contained" color="primary" onClick={joinRoom.bind(this, room.id)}>Join</Button>
                </TableCell>
              </TableRow>))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  </div>);
}

export default Rooms;
