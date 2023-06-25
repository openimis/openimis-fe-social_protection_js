import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  formatMessage,
  formatDateFromISO,
  ProgressOrError,
  withModulesManager,
} from '@openimis/fe-core';
import {
  TableHead,
  TableBody,
  Table,
  TableCell,
  TableRow,
  TableFooter,
  TableContainer,
  Paper,
} from '@material-ui/core';
import { withTheme, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CollapsableErrorList from '../components/CollapsableErrorList';
import { fetchUploadHistory } from '../actions';

const styles = (theme) => ({
  item: theme.paper.item,
});

function BenefitPlanBeneficiariesUploadHistoryDialog({
  modulesManager,
  intl,
  classes,
  fetchUploadHistory,
  benefitPlan,
  history,
  fetchedHistory,
  fetchingHistory,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [records, setRecords] = useState([]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      const params = [`benefitPlan_Id:"${benefitPlan.id}"`];
      fetchUploadHistory(params);
    }
  }, [isOpen]);

  useEffect(() => {
    setRecords(history);
  }, [fetchedHistory]);

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="outlined"
        color="#DFEDEF"
        className={classes.button}
        style={{
          border: '0px',
          marginTop: '6px',
        }}
      >
        {formatMessage(intl, 'socialProtection', 'benefitPlan.benefitPlanBeneficiaries.uploadHistory')}
      </Button>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          style: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '75%',
            maxWidth: '75%',
          },
        }}
      >
        <form noValidate>
          <DialogTitle
            style={{
              marginTop: '10px',
            }}
          >
            {formatMessage(intl, 'socialProtection', 'benefitPlan.benefitPlanBeneficiaries.upload.label')}
          </DialogTitle>
          <DialogContent>
            <div
              style={{ backgroundColor: '#DFEDEF' }}
            >

              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead className={classes.header}>
                    <TableRow className={classes.headerTitle}>
                      <TableCell>
                        {formatMessage(
                          intl,
                          'socialProtection',
                          'benefitPlan.benefitPlanBeneficiaries.uploadHistoryTable.workflow',
                        )}
                      </TableCell>
                      <TableCell>
                        {formatMessage(
                          intl,
                          'socialProtection',
                          'benefitPlan.benefitPlanBeneficiaries.uploadHistoryTable.dateCreated',
                        )}
                      </TableCell>
                      <TableCell>
                        {formatMessage(
                          intl,
                          'socialProtection',
                          'benefitPlan.benefitPlanBeneficiaries.uploadHistoryTable.sourceType',
                        )}
                      </TableCell>
                      <TableCell>
                        {formatMessage(
                          intl,
                          'socialProtection',
                          'benefitPlan.benefitPlanBeneficiaries.uploadHistoryTable.sourceName',
                        )}
                      </TableCell>
                      <TableCell>
                        {formatMessage(
                          intl,
                          'socialProtection',
                          'benefitPlan.benefitPlanBeneficiaries.uploadHistoryTable.status',
                        )}
                      </TableCell>
                      <TableCell>
                        {formatMessage(
                          intl,
                          'socialProtection',
                          'benefitPlan.benefitPlanBeneficiaries.uploadHistoryTable.error',
                        )}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <ProgressOrError progress={fetchingHistory} error={fetchedHistory} />
                    {records.map((item) => (
                      <TableRow key={item?.id}>
                        <TableCell>
                          { item.workflow }
                        </TableCell>
                        <TableCell>
                          { formatDateFromISO(modulesManager, intl, item.dataUpload.dateCreated) }
                        </TableCell>
                        <TableCell>
                          { item.dataUpload.sourceType}
                        </TableCell>
                        <TableCell>
                          { item.dataUpload.sourceName}
                        </TableCell>
                        <TableCell>
                          { item.dataUpload.status}
                        </TableCell>
                        <TableCell>
                          <CollapsableErrorList errors={item.dataUpload.error} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter />
                </Table>
              </TableContainer>
            </div>
          </DialogContent>
          <DialogActions
            style={{
              display: 'inline',
              paddingLeft: '10px',
              marginTop: '25px',
              marginBottom: '15px',
            }}
          >
            <div style={{ maxWidth: '1000px' }}>
              <div style={{ float: 'left' }}>
                <Button
                  onClick={handleClose}
                  variant="outlined"
                  autoFocus
                  style={{
                    margin: '0 16px',
                    marginBottom: '15px',
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

const mapStateToProps = (state) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
  confirmed: state.core.confirmed,
  history: state.socialProtection.beneficiaryDataUploadHistory,
  fetchedHistory: state.socialProtection.fetchedBeneficiaryDataUploadHistory,
  fetchingHistory: state.socialProtection.fetchingBeneficiaryDataUploadHistory,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUploadHistory,
}, dispatch);

export default injectIntl(
  withModulesManager(withTheme(
    withStyles(styles)(
      connect(mapStateToProps, mapDispatchToProps)(BenefitPlanBeneficiariesUploadHistoryDialog),
    ),
  )),
);
