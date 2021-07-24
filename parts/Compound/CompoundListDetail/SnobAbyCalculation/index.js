import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    width: '30%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  boldSubtitle: {
    fontWeight: 600,
  },
}));

const SnobApyCalculation = ({ totalAPY, yearlyAPY, userBoost }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="subtitle1" className={classes.boldSubtitle}>
        SNOB APR
      </Typography>
      <div className={classes.container}>
        <Typography variant="body2">SNOB APR</Typography>
        <Typography variant="subtitle2">{yearlyAPY?.toFixed(2)}%</Typography>
      </div>
      <div className={classes.container}>
        <Typography variant="body2">Boost</Typography>
        <Typography variant="subtitle2">{userBoost}</Typography>
      </div>
      <div className={classes.container}>
        <Typography variant="body2">Total APY</Typography>
        <Typography variant="subtitle2">{totalAPY?.toFixed(2)}%</Typography>
      </div>
    </div>
  );
};

export default memo(SnobApyCalculation);
