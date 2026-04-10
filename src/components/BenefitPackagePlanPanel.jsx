import React from 'react';
import {
  Grid, Typography, Paper, Divider, IconButton, Tooltip,
} from '@mui/material';
import {
  FormattedMessage,
  PublishedComponent,
  TextInput,
  NumberInput,
  FormPanel,
  formatMessage,
  GetIconComponent,
} from '@openimis/fe-core';
const PreviewIcon = GetIconComponent("ListAlt");
import { injectIntl } from 'react-intl';
import { styled } from '@mui/material/styles';
import BenefitPlanTypePicker from '../pickers/BenefitPlanTypePicker';
import { RIGHT_BENEFIT_PLAN_UPDATE, RIGHT_SCHEMA_UPDATE } from '../constants';
import BenefitPlanSchemaModal from '../dialogs/BenefitPlanSchemaModal';

const StyledGrid = styled(Grid)(({ theme }) => ({
  ...theme.table?.title ?? {},
}));

const StyledGridItem = styled(Grid)(({ theme }) => ({
  ...theme.paper?.item ?? {},
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  ...theme.paper?.paper ?? {},
}));

const StyledPaperHeader = styled(Grid)(({ theme }) => ({
  ...theme.paper?.header ?? {},
}));

const StyledFullHeight = styled(Grid)({
  height: '100%',
});

function renderHeadPanelTitle(benefitPlanTitle) {
  return (
    <StyledPaperHeader container alignItems="center" direction="row">
      <Grid size={8}>
        <StyledGrid container alignItems="center">
          {!!benefitPlanTitle && (
          <Grid>
            <Typography variant="h6">
              <FormattedMessage module="socialProtection" id={benefitPlanTitle} />
            </Typography>
          </Grid>
          )}
        </StyledGrid>
      </Grid>
    </StyledPaperHeader>
  );
}

function renderHeadPanelSubtitle(rights, intl, history, modulesManager, benefitPlan) {
  const openBenefitPlan = () => history.push(`/${modulesManager.getRef('socialProtection.route.benefitPlan')}`
  + `/${benefitPlan?.id}`);

  return (
    <Grid>
      <StyledFullHeight container align="center" justify="center" direction="column">
        <Typography>
          <Grid>
            <FormattedMessage
              module="socialProtection"
              id="socialProtection.benefitPackage.BenefitPlanDetailPanel.title"
            />
            { !!benefitPlan?.id && (
            <Tooltip title={formatMessage(intl, 'socialProtection', 'benefitPackage.BenefitPlanDetailPanel.tooltip')}>
              <IconButton onClick={openBenefitPlan} disabled={!rights.includes(RIGHT_BENEFIT_PLAN_UPDATE)}>
                <PreviewIcon />
              </IconButton>
            </Tooltip>
            )}
          </Grid>
        </Typography>
      </StyledFullHeight>
    </Grid>
  );
}

function BenefitPackagePlanPanel({
  benefitPlanTitle, benefitPlan, readOnly, intl, history, modulesManager, rights,
}) {
  return (
    <Grid container>
      <Grid size={12}>
        <StyledPaper>
          {renderHeadPanelTitle(benefitPlanTitle)}
          <Grid size={12}>
            <Divider />
          </Grid>
          <StyledGrid container>
            {renderHeadPanelSubtitle(rights, intl, history, modulesManager, benefitPlan)}
          </StyledGrid>
          <Grid container>
            <StyledGridItem size={3}>
              <TextInput
                module="socialProtection"
                label="benefitPlan.code"
                value={benefitPlan?.code ?? ''}
                readOnly={readOnly}
              />
            </StyledGridItem>
            <StyledGridItem size={3}>
              <TextInput
                module="socialProtection"
                label="benefitPlan.name"
                value={benefitPlan?.name ?? ''}
                readOnly={readOnly}
              />
            </StyledGridItem>
            <StyledGridItem size={3}>
              <PublishedComponent
                pubRef="core.DatePicker"
                module="socialProtection"
                label="benefitPlan.dateValidFrom"
                value={benefitPlan?.dateValidFrom ?? ''}
                readOnly={readOnly}
              />
            </StyledGridItem>
            <StyledGridItem size={3}>
              <PublishedComponent
                pubRef="core.DatePicker"
                module="socialProtection"
                label="benefitPlan.dateValidTo"
                value={benefitPlan?.dateValidTo ?? ''}
                readOnly={readOnly}
              />
            </StyledGridItem>
            <StyledGridItem size={3}>
              <NumberInput
                min={0}
                displayZero
                module="socialProtection"
                label="benefitPlan.maxBeneficiaries"
                value={benefitPlan?.maxBeneficiaries ?? ''}
                readOnly={readOnly}
              />
            </StyledGridItem>
            <StyledGridItem size={3}>
              <TextInput
                module="socialProtection"
                label="benefitPlan.institution"
                value={benefitPlan?.institution ?? ''}
                readOnly={readOnly}
              />
            </StyledGridItem>
            <StyledGridItem size={3}>
              <BenefitPlanTypePicker
                module="socialProtection"
                label="beneficiary.benefitPlanTypePicker"
                value={!!benefitPlan?.type && benefitPlan.type}
                readOnly={readOnly}
              />
            </StyledGridItem>
            {rights.includes(RIGHT_SCHEMA_UPDATE) && (
              <StyledGridItem size={3}>
                <BenefitPlanSchemaModal
                  benefitPlan={benefitPlan}
                />
              </StyledGridItem>
            )}
          </Grid>
        </StyledPaper>
      </Grid>
    </Grid>
  );
}

export { StyledGrid };
export default injectIntl(BenefitPackagePlanPanel);
