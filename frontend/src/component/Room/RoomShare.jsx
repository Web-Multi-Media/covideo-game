import React, {useState, useRef} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import DirectionsIcon from '@material-ui/icons/Directions';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ShareIcon from '@material-ui/icons/Share';
import TextIcon from '../TextIcon/TextIcon';
import './RoomShare.css'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

function RoomShare(props) {
  const classes = useStyles();
  const url = props.url;
  const [copySuccess, setCopySuccess] = useState('');

  function copyToClipboard(e) {
    navigator.clipboard.writeText(url)
    setCopySuccess('Copied!');
  };

  return (<React.Fragment>
    <TextIcon size="h4" icon={<ShareIcon fontSize="large"/>} text="Share"/>
    <p>Share the room link with your friends !</p>
    <Paper component="form" className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder={url}
        disabled={true}
        inputProps={{ 'aria-label': 'share room' }}
      />
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={copyToClipboard}>
        <Tooltip title="Copy link" aria-label="copy">
          <FileCopyIcon />
        </Tooltip>
      </IconButton>
      {copySuccess}
    </Paper>
  </React.Fragment>);
}

export default RoomShare;
