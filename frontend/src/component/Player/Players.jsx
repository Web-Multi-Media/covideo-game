import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import PeopleIcon from '@material-ui/icons/People';
import PlayerAdd from "./PlayerAdd";
import PlayerAvatar from "./PlayerAvatar";
import TextIcon from '../TextIcon/TextIcon';
import './Players.css';

const useStyles = makeStyles({
  table: {
    minWidth: 300,
    maxWidth: 800
  },
  wrapIcon: {
    verticalAlign: 'middle',
    display: 'inline-flex'
  }
});

function Players(props) {
  const classes = useStyles();
  const players = props.players;
  const gameMaster = props.gameMaster;
  const isGameMaster = props.isGameMaster;
  const currentPlayer = props.currentPlayer;

  return (
    <div>
    <TextIcon size="h4" icon={<PeopleIcon fontSize="large"/>} text="Players"/>
    {players.length === 0 && <p>No players in room yet. Add your name !</p>}
    <TableContainer component={Paper}>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Player</b>
                </TableCell>
                <TableCell align="left">
                  <b>ID</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                players.map((p) => (<TableRow key={p.id}>
                  <TableCell component="th" scope="row">
                    <PlayerAvatar
                      player={p}
                      currentPlayer={currentPlayer}
                      gameMaster={gameMaster}/>
                  </TableCell>
                  <TableCell align="left">{p.id}</TableCell>
                  <TableCell align="left">
                    {
                      p.id !== gameMaster && isGameMaster &&
                          <Button id="outlined-basic-name" className="margButt" variant="contained" color="primary" onClick={props.kickPlayer.bind(this, p.id)}>
                            Kick player
                          </Button>
                    }
                  </TableCell>
                </TableRow>))
              }
              {!currentPlayer &&
                <TableCell component="th" scope="row">
                <PlayerAdd onSendUsername={props.onSendUsername} currentPlayer={currentPlayer}/>
                </TableCell>}
            </TableBody>
          </Table>
        </TableContainer>
  </div>);
}

export default Players;
