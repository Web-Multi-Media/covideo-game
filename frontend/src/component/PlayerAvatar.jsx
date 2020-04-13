import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import {makeStyles} from '@material-ui/core/styles';

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

const useStyles = makeStyles({});

function PlayerAvatar(props) {
  const player = props.player;
  const classes = useStyles();

  return (<React.Fragment>
    <Avatar style={{
        'backgroundColor' : stringToColor(player.name)
      }} className={classes.small}>
      {player.name.charAt(0).toUpperCase()}
    </Avatar>
    <b>{player.name.capitalize()}</b>
  </React.Fragment>);
}

export default PlayerAvatar;
