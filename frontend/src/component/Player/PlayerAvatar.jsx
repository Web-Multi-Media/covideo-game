import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

function stringToColor(string) {
  let hash = 0;
  let i;
  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */
  return color;
}

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  }
}));

function PlayerAvatar(props) {
  const player = props.player;
  const gameMaster = props.gameMaster;
  const classes = useStyles();

  return (<React.Fragment>
    <Grid container alignItems="center">
    {
      player.id !== gameMaster && <React.Fragment>
          <Grid item>
          <Avatar style={{
              'backgroundColor' : stringToColor(player.name)
            }} className={classes.small}>
          {player.name.charAt(0).toUpperCase()}
          </Avatar>
          </Grid>
        </React.Fragment>
    }
    {
      player.id === gameMaster && <React.Fragment>
        <Grid item>
        <Avatar style={{
            'backgroundColor' : '#f2ed94',
          }} src='https://api.iconify.design/mdi-crown.svg' className={classes.small}/>
        </Grid>
        </React.Fragment>
    }
    <Grid item>
    {player.name.capitalize()}
    </Grid>
    </Grid>
  </React.Fragment>);
}

export default PlayerAvatar;
