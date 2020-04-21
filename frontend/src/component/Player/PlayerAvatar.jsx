import React from 'react';
import { makeStyles } from '@material-ui/styles';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import './PlayerAvatar.css'

const useStyles = makeStyles(({ palette }) => ({
  header: {
    padding: '0px',
    marginTop: '2px',
    marginBottom: '2px',
    display: 'flex'
  },
  avatar: {
    marginRight: '0px !important'
  },
  tableInput: {
    width: '40%'
  }
}));

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

function PlayerAvatar(props){
  const classes = useStyles();
  const [editMode, setEditMode] = React.useState(false);
  const [textInput, setTextInput] = React.useState('');

  const handleNameChange = (event) => {
    setTextInput(event.target.value);
  };

  function onSendUsername(){
    if (!textInput){
      return;
    }
    setEditMode(false);
    props.onSendUsername(textInput);
  };

  function getFirstLetter(string){
    return string.charAt(0).toUpperCase();
  };

  function getAvatar(player, isGameMaster){
    return (<React.Fragment>
      {!isGameMaster && player.name !== "" &&
        <Avatar aria-label="recipe" className={classes.avatar} style={{'backgroundColor': stringToColor(player.name)}}>
          {getFirstLetter(player.name)}
        </Avatar>
      }
      {isGameMaster &&
        <Avatar src='https://api.iconify.design/mdi-crown.svg' style={{'backgroundColor': 'yellow'}} className={classes.avatar}/>
      }
      </React.Fragment>);
  };

  function getDisplayName(player, isCurrentPlayer, editMode){
    let string = ""
    if (!editMode){
      string = `${player.name}`
      if (isCurrentPlayer){
        string = string.concat(' (you)');
      }
    }
    return (<Typography>
      <b>{string}</b>
      {isCurrentPlayer && !editMode && <React.Fragment>
        <IconButton
          size="small"
          color="primary"
          onClick={setEditMode.bind(this, true)}>
        <EditIcon fontSize="small"/>
        </IconButton>
        </React.Fragment>
      }
      {isCurrentPlayer && editMode && <React.Fragment>
        <TextField
          id="input-with-icon-textfield"
          size="small"
          className={classes.tableInput}
          label=""
          value={textInput}
          onChange={handleNameChange}/>
        <IconButton
          size="small"
          color="primary"
          onClick={onSendUsername}>
          <CheckIcon fontSize="small"/>
        </IconButton>
        </React.Fragment>
      }
    </Typography>);
  };

  return (<React.Fragment>
    {props.displayPlayerName &&
    <CardHeader
      className={classes.header}
      avatar={getAvatar(props.player, props.isGameMaster)}
      title={getDisplayName(props.player, props.isCurrentPlayer, editMode)}
      subheader={props.player.status}
      titleTypographyProps={{className: classes.noPadding}}/>
  }
  {!props.displayPlayerName && <React.Fragment>
    {getAvatar(props.player, props.isGameMaster)}
    </React.Fragment>
  }
  </React.Fragment>);
};


export default PlayerAvatar;
