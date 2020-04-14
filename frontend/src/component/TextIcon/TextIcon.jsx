import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import './TextIcon.css'

const useStyles = makeStyles((theme) => ({
  typography: {
    marginTop: 20,
    marginBottom: 10
  },
}));

function TextIcon(props) {
  const classes = useStyles();
  return (<React.Fragment>
    <Grid container className={classes.typography} direction="row" alignItems="center">
      <Grid item>
        {props.icon}
      </Grid>
      <Grid item>
        <Typography variant={props.size}>&nbsp;<b>{props.text}</b></Typography>
      </Grid>
    </Grid>
  </React.Fragment>);
}

export default TextIcon;
