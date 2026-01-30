import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  formatMessage,
  formatDateTimeFromISO,
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CollapsableErrorList from '../components/CollapsableErrorList';
import { fetchUploadHistory } from '../actions';
import { downloadBeneficiaryUploadFile, downloadInvalidItems } from '../util/export';
import { UPLOAD_STATUS } from '../constants';

const StyledButton = styled(Button)(({ theme }) => ({
  ...theme.paper.item,
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  ...theme.paper.item,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  ...theme.paper.item,
}));

function BenefitPlanBeneficiariesUploadHistoryDialog({
  modulesManager,
  intl,
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

  const downloadInvalidItemsFromUpload = (uploadId) => {
    downloadInvalidItems(uploadId);
  };

  const downloadFile = (filename) => {
    downloadBeneficiaryUploadFile(benefitPlan?.id, filename);
  };

  useEffect(() => {
    if (isOpen && benefitPlan?.id) {
      const params = [`benefitPlan_Id:"${benefitPlan.id}", orderBy: ["-dateCreated"]`];
      fetchUploadHistory(params);
    }
  }, [isOpen, benefitPlan?.id]);

  useEffect(() => {
    setRecords(history);
  }, [fetchedHistory]);

  return (
    <>
      <StyledButton
        onClick={handleOpen}
        variant="outlined"
        color="#DFEDEF"
        style={{
          border: '0px',
          marginTop: '6px',
        }}
      >
        {formatMessage(intl, 'socialProtection', 'benefitPlan.benefitPlanBeneficiaries.uploadHistory')}
      </StyledButton>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          style: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '85%',
            maxWidth: '85%',
            maxHeight: '75%',
          },
        }}
      >
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
                <StyledTableHead>
                  <StyledTableRow>
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
                        'benefitPlan.benefitPlanBeneficiaries.uploadHistoryTable.user',
                      )}
                    </TableCell>
                    <TableCell>
                      {formatMessage(
                        intl,
                        'socialProtection',
                        'benefitPlan.benefitPlanBeneficiaries.uploadHistoryTable.error',
                      )}
                    </TableCell>
                    <TableCell>
                      {formatMessage(
                        intl,
                        'socialProtection',
                        'benefitPlan.benefitPlanBeneficiaries.uploadHistoryTable.validationErrors',
                      )}
                    </TableCell>
                    <TableCell />
                  </StyledTableRow>
                </StyledTableHead>
                <TableBody>
                  <ProgressOrError progress={fetchingHistory} error={fetchedHistory} />
                  {records.map((item) => (
                    <TableRow key={item?.id}>
                      <TableCell>
                        { item.workflow }
                      </TableCell>
                      <TableCell>
                        { formatDateTimeFromISO(modulesManager, intl, item.dataUpload.dateCreated) }
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
                        { item.dataUpload.userCreated.username}
                      </TableCell>
                      <TableCell>
                        <CollapsableErrorList errors={item.dataUpload.error} />
                      </TableCell>
                      <TableCell>
                        {[UPLOAD_STATUS.PARTIAL_SUCCESS].includes(item.dataUpload.status) && (
                          <Button
                            onClick={() => downloadInvalidItemsFromUpload(item.dataUpload.uuid)}
                            variant="outlined"
                            autoFocus
                            style={{
                              margin: '0 16px',
                              marginBottom: '15px',
                            }}
                          >
                            {formatMessage(
                              intl,
                              'socialProtection',
                              'benefitPlan.benefitPlanBeneficiaries.uploadHistoryTable.downloadInvalidItems',
                            )}
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => downloadFile(item.dataUpload.sourceName)}
                          variant="outlined"
                          autoFocus
                          style={{
                            margin: '0 16px',
                            marginBottom: '15px',
                          }}
                        >
                          {formatMessage(
                            intl,
                            'socialProtection',
                            'benefitPlan.benefitPlanBeneficiaries.uploadHistoryTable.downloadUploadFile',
                          )}
                        </Button>
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

export { StyledButton };
export default injectIntl(
  withModulesManager(
    connect(mapStateToProps, mapDispatchToProps)(BenefitPlanBeneficiariesUploadHistoryDialog),
  ),
);
