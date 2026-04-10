import React from 'react';
import {
  Grid, Typography, IconButton, Tooltip,
} from '@mui/material';
import {
  FormattedMessage,
  TextInput,
  FormPanel,
  formatMessage,
  createFieldsBasedOnJSON,
  renderInputComponent,
  GetIconComponent,
} from '@openimis/fe-core';
const PeopleIcon = GetIconComponent("People")

import { injectIntl } from 'react-intl';
import { styled } from '@mui/material/styles';
import { EMPTY_STRING, RIGHT_GROUP_UPDATE, SOCIAL_PROTECTION_MODULE } from '../constants';

const StyledGrid = styled(Grid)(({ theme }) => ({
  ...theme.table?.title ?? {},
}));

const StyledGridItem = styled(Grid)(({ theme }) => ({
  ...theme.paper?.item ?? {},
}));

const StyledFullHeight = styled(Grid)({
  height: '100%',
});

function renderHeadPanelSubtitle(rights, intl, history, modulesManager, groupUuid) {
  const openGroup = () => history.push(`/${modulesManager.getRef('individual.route.group')}`
  + `/${groupUuid}`);

  return (
    <Grid>
      <StyledFullHeight container align="center" justify="center" direction="column">
        <Grid>
          <Typography>
            <FormattedMessage
              module={SOCIAL_PROTECTION_MODULE}
              id="socialProtection.benefitPackage.GroupDetailPanel.title"
            />
            { !!groupUuid && (
            <Tooltip title={formatMessage(intl, SOCIAL_PROTECTION_MODULE, 'benefitPackage.GroupDetailPanel.tooltip')}>
              <IconButton onClick={openGroup} disabled={!rights.includes(RIGHT_GROUP_UPDATE)}>
                <PeopleIcon />
              </IconButton>
            </Tooltip>
            )}
          </Typography>
        </Grid>
      </StyledFullHeight>
    </Grid>
  );
}

function BenefitPackageGroupPanel({
  readOnly, intl, history, modulesManager, rights, groupBeneficiaries,
}) {
  if (!groupBeneficiaries) return null;

  const { group: { uuid }, status, jsonExt } = groupBeneficiaries;

  const jsonExtFields = createFieldsBasedOnJSON(jsonExt);

  return (
    <>
      <StyledGrid container>
        {renderHeadPanelSubtitle(rights, intl, history, modulesManager, uuid)}
      </StyledGrid>
      <Grid container>
        <StyledGridItem size={3}>
          <TextInput
            module={SOCIAL_PROTECTION_MODULE}
            label="beneficiary.status"
            value={status ?? EMPTY_STRING}
            readOnly={readOnly}
          />
        </StyledGridItem>
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
export default injectIntl(BenefitPackageGroupPanel);
