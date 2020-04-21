import React from 'react';
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
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import TextIcon from '../TextIcon/TextIcon';
import AvatarGroup from '@material-ui/lab/AvatarGroup';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

function Rooms(props) {
  const classes = useStyles();
  const rooms = props.rooms;
  const currentPlayer = props.currentPlayer;
  const joinRoom = (roomId) => {
    props.joinRoom(roomId);
  }

  return (<div>
    <TextIcon size="h4" icon={<MeetingRoomIcon fontSize="large"/>} text="Rooms"/>
    {
      rooms.length > 0 && <TableContainer component={Paper}>
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
            rooms.map((room) => (!room.settings.private && <TableRow key={room.id}>
              <TableCell component="th" scope="row">
                <b>{room.id}</b>
              </TableCell>
              <TableCell align="left">{new Date(room.lastActivity).toDateString()}</TableCell>
              <TableCell align="left">{room.scoreFirstTeam} - {room.scoreSecondTeam}</TableCell>
              <TableCell align="left">
                <AvatarGroup max={2} spacing='small'>
                {
                  room.players.map((player) => (
                    <PlayerAvatar
                      key={player.id}
                      player={player}
                      isGameMaster={player.id === room.gameMaster}
                      isCurrentPlayer={player.id === currentPlayer.id}
                      gridContainerProps={{'justify': 'flex-start'}}
                      displayPlayerName={false}
                      onSendUsername={props.onSendUsername}/>
                  ))
                }
                </AvatarGroup>
              </TableCell>
              <TableCell align="left">
                <Button
                  id="outlined-basic-name"
                  className="margButt"
                  variant="contained"
                  color="primary"
                  onClick={() => joinRoom(room.id)}
                  disabled={(room.players.length >= room.settings.numMaxPlayers)}>
                Join
                </Button>
              </TableCell>
            </TableRow>))
          }
        </TableBody>
      </Table>
    </TableContainer>
    }
    {rooms.length === 0 && <div>No rooms.</div>}
  </div>);
}

export default Rooms;
