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
import ErrorIcon from "@material-ui/icons/ErrorOutline";
import { withTheme, withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  item: theme.paper.item,
});

function CollapsableErrorList({
  intl,
  errors,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOpen = () => {
    setIsExpanded(!isExpanded);
  };

  if (!errors || !Object.keys(errors).length) {
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

  const formatErrorMessage = (errorObj) => {
    try {
      // Initialize an array to hold formatted error messages
      const formattedMessages = [];

      // Iterate over the object keys and format the message
      for (const [key, value] of Object.entries(errorObj)) {
        formattedMessages.push(
        <>

        <ListItem>
          <ErrorIcon/><ListItemText primary={key} style={{ marginLeft: '20px' }} primaryTypographyProps={{ style: { fontWeight: 'bold' } }}/>
        </ListItem>
        <ListItem>
          <ListItemText primary={value}  style={{ marginLeft: '40px' }}/>
        </ListItem>
        </>
          );
      }
  
      // Join the formatted messages with line breaks for display
      return formattedMessages
    } catch (e) {
      // Fallback in case of parsing error
      return "Error parsing the error message.";
    }
  };

  
  return (
    <>
      <ListItem button onClick={handleOpen}>
        <ListItemText primary={formatMessage(
          intl,
          'socialProtection',
          'benefitPlan.benefitPlanBeneficiaries.uploadHistoryTable.error',
        )}
        />
        {isExpanded ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <pre>{formatErrorMessage(errors)}</pre>
      </Collapse>
    </>
  );
}

export default injectIntl(
  withTheme(
    withStyles(styles)(CollapsableErrorList),
  ),
);
