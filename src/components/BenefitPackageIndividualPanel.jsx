import React from 'react';
import {
  Grid, Typography, IconButton, Tooltip,
} from '@mui/material';
import {
  FormattedMessage,
  PublishedComponent,
  TextInput,
  formatMessage,
  createFieldsBasedOnJSON,
  renderInputComponent,
  GetIconComponent,
} from '@openimis/fe-core';
import { injectIntl } from 'react-intl';
import { styled } from '@mui/material/styles';
import { EMPTY_STRING, RIGHT_INDIVIDUAL_UPDATE, SOCIAL_PROTECTION_MODULE } from '../constants';

const Person = GetIconComponent('Person');

const StyledGrid = styled(Grid)(({ theme }) => ({
  ...theme.table?.title ?? {},
}));

const StyledGridItem = styled(Grid)(({ theme }) => ({
  ...theme.paper?.item ?? {},
}));

const StyledFullHeight = styled(Grid)({
  height: '100%',
});

function renderHeadPanelSubtitle(rights, intl, history, modulesManager, individualUuid) {
  const openIndividual = () => history.push(`/${modulesManager.getRef('individual.route.individual')}`
    + `/${individualUuid}`);

  return (
    <Grid>
      <StyledFullHeight container align="center" justify="center" direction="column">
        <Grid>
          <Typography>
            <FormattedMessage
              module={SOCIAL_PROTECTION_MODULE}
              id="socialProtection.benefitPackage.IndividualDetailPanel.title"
            />
            { !!individualUuid && (
            <Tooltip title={formatMessage(
              intl,
              SOCIAL_PROTECTION_MODULE,
              'benefitPackage.IndividualDetailPanel.tooltip',
            )}
            >
              <IconButton onClick={openIndividual} disabled={!rights.includes(RIGHT_INDIVIDUAL_UPDATE)}>
                <Person />
              </IconButton>
            </Tooltip>
            )}
          </Typography>
        </Grid>
      </StyledFullHeight>
    </Grid>
  );
}

function BenefitPackageIndividualPanel({
  readOnly, intl, history, modulesManager, rights, beneficiary,
}) {
  if (!beneficiary) return null;

  const {
    individual, status, jsonExt,
  } = beneficiary;

  const jsonExtFields = createFieldsBasedOnJSON(jsonExt);

  return (
    <>
      <StyledGrid container>
        {renderHeadPanelSubtitle(rights, intl, history, modulesManager, individual?.uuid)}
      </StyledGrid>
      <Grid container>
        <StyledGridItem size={3}>
          <TextInput
            module={SOCIAL_PROTECTION_MODULE}
            label="beneficiary.firstName"
            value={individual.firstName}
            readOnly={readOnly}
          />
        </StyledGridItem>
        <StyledGridItem size={3}>
          <TextInput
            module={SOCIAL_PROTECTION_MODULE}
            label="beneficiary.lastName"
            value={individual.lastName}
            readOnly={readOnly}
          />
        </StyledGridItem>
        <StyledGridItem size={3}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module={SOCIAL_PROTECTION_MODULE}
            label="beneficiary.dob"
            value={individual.dob}
            readOnly={readOnly}
          />
        </StyledGridItem>
        <StyledGridItem size={3}>
          <TextInput
            module={SOCIAL_PROTECTION_MODULE}
            label="beneficiary.status"
            value={status ?? EMPTY_STRING}
            readOnly={readOnly}
          />
        </StyledGridItem>
        <Grid size={12}>
          <PublishedComponent
            pubRef="location.DetailedLocation"
            withNull
            readOnly // TODO: readonly if belong to group
            required={false}
            value={!individual ? null : individual.location}
          />
        </Grid>
        {jsonExtFields?.map((jsonExtField) => (
          <StyledGridItem size={3}>
            {renderInputComponent(SOCIAL_PROTECTION_MODULE, jsonExtField)}
          </StyledGridItem>
        ))}
      </Grid>
    </>
  );
}

export { StyledGrid };
export default injectIntl(BenefitPackageIndividualPanel);
