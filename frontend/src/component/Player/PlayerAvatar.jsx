import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';
import './PlayerAvatar.css';

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

/* eslint-disable no-extend-native */
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    margin: '2px',
    backgroundColor: '#f2ed94'
  },
  tableInput: {
    width: '40%'
  },
  text: {
    marginRight: '5px',
    display: 'inline-flex',
    fontSize: '1rem'
  }
}));

function PlayerAvatar(props) {
  const [editMode, setEditMode] = useState(false);
  const [textInput, setTextInput] = useState('');
  const player = props.player;
  const isCurrentPlayer = props.isCurrentPlayer;
  const isGameMaster = props.isGameMaster;
  const classes = useStyles();
  const gridContainerProps = props.gridContainerProps;
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

  return (<React.Fragment>
    <Grid container alignItems="center" {...gridContainerProps}>
      {!isGameMaster && player.name !== "" &&
        <Grid item>
          <Avatar style={{'backgroundColor': stringToColor(player.name)}} className={classes.small}>
            {getFirstLetter(player.name)}
          </Avatar>
        </Grid>
      }
      {isGameMaster &&
        <Grid item>
          <Avatar src='https://api.iconify.design/mdi-crown.svg' className={classes.small}/>
        </Grid>
      }
      {!isCurrentPlayer &&
        <Grid item className={classes.text}>
          <b>{player.name.capitalize()}</b>
        </Grid>
      }
      {isCurrentPlayer && <React.Fragment>
         {!editMode && <React.Fragment>
           <Grid item className={classes.text}>
            <b>{player.name.capitalize()}</b>&nbsp;(you)
           </Grid>
           &nbsp;
           <Grid item>
             <IconButton
               size="small"
               color="primary"
               onClick={setEditMode.bind(this, true)}>
               <EditIcon fontSize="small"/>
             </IconButton>
            </Grid>
            </React.Fragment>
         }
         {editMode && <React.Fragment>
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
         </React.Fragment>
      }
    </Grid>
  </React.Fragment>);
}

export default PlayerAvatar;
