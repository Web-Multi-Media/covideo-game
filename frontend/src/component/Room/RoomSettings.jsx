import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import SettingsIcon from '@material-ui/icons/Settings';
import TextIcon from '../TextIcon/TextIcon';
import './Rooms.css'

const useStyles = makeStyles((theme) => ({}));

function RoomSettings(props) {
  const classes = useStyles();
  return (<React.Fragment>
    <TextIcon size="h4" icon={<SettingsIcon fontSize="large"/>} text="Settings"/>
    TO DO
  </React.Fragment>);
}

export default RoomSettings;
