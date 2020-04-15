import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: '100%',
    width: '100%',
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: '10px'
  },
  circledNumber: {
    width: 50,
    height: 50,
    textAlign: 'center',
    borderRadius: '50%',
    color: 'green',
    margin: '0 auto',
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  typography: {
    ...theme.typography.button,
    fontSize: "1.2rem"
  }
}));

function Round(props) {
  const classes = useStyles();
  return (<React.Fragment>
    <Paper className={classes.paper} elevation={3}>
      <Typography variant="h6" fontSize="large" className={classes.typography}><b>Current round</b></Typography>
      <Paper elevation={3} className={classes.circledNumber}>
        <Typography variant="h4">
          {props.set}
        </Typography>
      </Paper>
    </Paper>
  </React.Fragment>);
}

export default Round;
