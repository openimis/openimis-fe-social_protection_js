import React from 'react';
import {
  Box,
  Paper,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {
  useTranslations,
  useModulesManager,
} from '@openimis/fe-core';
import BenefitPlanTasksSearcher from '../components/BenefitPlanTasksSearcher';

const useStyles = makeStyles((theme) => ({
  page: theme.page,
  paper: theme.paper.paper,
  title: theme.paper.title,
}));

function BenefitPlanTasksPage({ rights }) {
  const classes = useStyles();
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations('tasksManagement', modulesManager);

  return (
    <Box className={classes.page}>
      <Paper className={classes.paper}>
        <Typography className={classes.title}>
          {formatMessage('benefitPlan.tasks.title')}
        </Typography>
        <div className={classes.page}>
          <BenefitPlanTasksSearcher rights={rights} classes={classes} />
        </div>
      </Paper>
    </Box>
  );
}

export default BenefitPlanTasksPage;
