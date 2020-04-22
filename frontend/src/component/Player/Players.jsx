import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import PeopleIcon from '@material-ui/icons/People';
import PlayerAvatar from "./PlayerAvatar";
import TextIcon from '../TextIcon/TextIcon';

const useStyles = makeStyles({
  table: {
    width: '100%'
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
        <TableBody>
        {
          players.map((p) => (<TableRow key={p.id}>
            <TableCell component="th" scope="row">
              <PlayerAvatar
                player={p}
                isCurrentPlayer={p.id === currentPlayer.id}
                isGameMaster={p.id === gameMaster}
                gameMaster={gameMaster}
                displayPlayerName={true}
                onSendUsername={props.onSendUsername}/>
            </TableCell>
            <TableCell component="th" scope="row">
              <p> {p.words}/{props.wordNumber}</p>
            </TableCell>
            <TableCell align="left">
              {
                isGameMaster && p.id !== currentPlayer.id &&
                <Button
                  id="outlined-basic-name"
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={props.kickPlayer.bind(this, p.id)}>
                Kick
                </Button>
              }
            </TableCell>
          </TableRow>))
        }
        </TableBody>
      </Table>
    </TableContainer>
  </div>);
}

export default Players;
