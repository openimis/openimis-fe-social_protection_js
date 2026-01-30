import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { injectIntl } from 'react-intl';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  formatMessage,
  TextInput,
} from '@openimis/fe-core';
import { styled } from '@mui/material/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchWorkflows } from '../actions';

const StyledButton = styled(Button)(({ theme }) => ({
  ...theme.paper.item,
}));

function BenefitPlanSchemaDialog({
  intl,
  benefitPlan,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

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
        {formatMessage(intl, 'socialProtection', 'benefitPlan.schema.showSchema')}
      </StyledButton>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: 600,
            maxWidth: 600,
            maxHeight: 1000,
          },
        }}
      >
        <form noValidate>
          <DialogTitle
            style={{
              marginTop: '10px',
            }}
          >
            {formatMessage(intl, 'socialProtection', 'benefitPlan.benefitPlanSchema.label')}
          </DialogTitle>
          <DialogContent>
            <div
              style={{ backgroundColor: '#DFEDEF', paddingLeft: '10px', paddingBottom: '10px' }}
            >
              <Grid>
                <Grid container spacing={4} direction="column">
                  <Grid>
                    <TextInput
                      module="socialProtection"
                      label="benefitPlan.schema"
                      readOnly
                      value={benefitPlan?.beneficiaryDataSchema}
                      multiline
                    />
                  </Grid>
                </Grid>
              </Grid>
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
              <div style={{ float: 'right', paddingRight: '16px' }} />
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

const mapStateToProps = (state) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchWorkflows,
}, dispatch);

export { StyledButton };
export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(BenefitPlanSchemaDialog),
);
