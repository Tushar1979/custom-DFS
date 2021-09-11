import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import "./style.css"

const useStyles = makeStyles((theme) => ({
    root: {

    },
}));

export default function CircularSpinner() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CircularProgress />
        </div>
    );
}
