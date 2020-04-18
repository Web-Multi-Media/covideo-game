import React from 'react';
import { makeStyles } from '@material-ui/styles';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVert from '@material-ui/icons/MoreVert';

const useStyles = makeStyles(({ palette }) => ({
  avatar: {
    // marginRight: '5px',
    // display: 'inline-flex',
    // fontSize: '1rem',
    backgroundColor: palette.primary.main,
  },
  gameMasterAvatar: {
    backgroundColor: '#f2ed94'
  },
  action: {
    marginLeft: 8,
  },
}));

const PlayerAvatarNew = () => {
  const classes = useStyles();
  const [editMode, setEditMode] = useState(false);
  const [textInput, setTextInput] = useState('');
  const gameMaster = props.gameMaster;
  const classes = useStyles();
  const gridContainerProps = props.gridContainerProps;

  const handleNameChange = (event) => {
    setTextInput(event.target.value);
  };

  function onSendUsername(){
    setEditMode(false);
    props.onSendUsername(textInput);
  };

  function getFirstLetter(string){
    return string.charAt(0).toUpperCase();
  };

  function getAvatar(player, isGameMaster){
    {!isGameMaster && player.name !== "" &&
      <Avatar aria-label="recipe" style={{'backgroundColor': stringToColor(player.name)}} className={classes.avatar}>
        {getFirstLetter(player.name)}
      </Avatar>
    }
    {isGameMaster &&
      <Avatar src='https://api.iconify.design/mdi-crown.svg' className={classes.avatar}/>
    }
  };

  function getDisplayName(player, isCurrentPlayer){
    let string=`<b>${player.name}</b>"
    if (isCurrentPlayer){
      string = string.concat(' (you)');
    }
    return string;
  };

  return (
    <CardHeader
      classes={{
        action: classes.action,
      }}
      avatar={getAvatar(props.player, props.isGameMaster)}
      action={
        <IconButton aria-label="settings">
          <MoreVert />
        </IconButton>
      }
      title={getDisplayName(props.player, props.isCurrentPlayer)}
      subheader="September 14, 2016"/>
  );
};


export default PlayerAvatarNew;
