import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {
  formatMessage,
} from '@openimis/fe-core';
import {
  ListItem,
  ListItemText,
  Collapse,
} from '@material-ui/core';
import { withTheme, withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  item: theme.paper.item,
});

function CollapsableErrorList({
  intl,
  errors,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  if (!errors || Object.keys(errors).length === 0) {
    return (
      <ListItem>
        <ListItemText primary={formatMessage(
          intl,
          'socialProtection',
          'benefitPlan.benefitPlanBeneficiaries.uploadHistoryTable.errorNone',
        )}
        />
      </ListItem>
    );
  }

  return (
    <>
      <ListItem button onClick={handleOpen}>
        <ListItemText primary={formatMessage(
          intl,
          'socialProtection',
          'benefitPlan.benefitPlanBeneficiaries.uploadHistoryTable.error',
        )}
        />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        { JSON.stringify(errors) }
      </Collapse>
    </>
  );
}

export default injectIntl(
  withTheme(
    withStyles(styles)(CollapsableErrorList),
  ),
);
