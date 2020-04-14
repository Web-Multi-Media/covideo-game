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
import PlayerAvatar from "./PlayerAvatar";
import './Players.css';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
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
  const kickPlayer = (name) => {
    props.kickPlayer(name);
  }

  return (<div>
    <h1>Players</h1>
    {
      players.length > 0 && <TableContainer component={Paper}>
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
                    <PlayerAvatar player={p} gameMaster={gameMaster}/>
                  </TableCell>
                  <TableCell align="left">{p.id}</TableCell>
                  <TableCell align="left">
                    {
                      p.id !== gameMaster && isGameMaster && <React.Fragment>
                          <Button id="outlined-basic-name" className="margButt" variant="contained" color="primary" onClick={kickPlayer.bind(this, p.name)}>
                            Kick player
                          </Button>
                        </React.Fragment>
                    }
                  </TableCell>
                </TableRow>))
              }
            </TableBody>
          </Table>
        </TableContainer>
    }
    {players.length === 0 && <div>No players yet.</div>}
  </div>);
}

export default Players;
