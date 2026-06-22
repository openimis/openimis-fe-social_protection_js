import React from 'react';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { connect } from 'react-redux';
import {
  ValidatedTextInput,
  NumberInput,
  PublishedComponent,
  TextInput,
  withModulesManager,
} from '@openimis/fe-core';
import { injectIntl } from 'react-intl';
import {
  projectNameSetValid,
  projectNameValidationCheck,
  projectNameValidationClear,
} from '../actions';
import ProjectStatusPicker from '../pickers/ProjectStatusPicker';
import ActivityPicker from '../pickers/ActivityPicker';
import { DEFAULT_MAX_WORKING_DAYS } from '../constants';

const StyledGrid = styled(Grid)(({ theme }) => ({
  ...theme.paper?.item ?? {},
}));

const StyledGridItem = styled(Grid)(({ theme }) => ({
  ...theme.paper?.item ?? {},
}));

function ProjectHeadPanel({
  edited,
  isProjectNameValid,
  isProjectNameValidating,
  projectNameValidationError,
  savedProjectName,
  readOnly,
  updateAttribute,
  modulesManager,
}) {
  const project = { ...edited };
  const isNewProject = !project?.id;
  const maxWorkingDays = modulesManager.getConf('fe-social_protection', 'maxWorkingDays', DEFAULT_MAX_WORKING_DAYS);

  const shouldValidate = (inputValue, savedValue) => {
    if (!savedValue) return false;
    return !edited?.id || inputValue !== savedValue;
  };

  return (
    <StyledGrid container>
      <StyledGridItem size={4}>
        <ValidatedTextInput
          module="socialProtection"
          label="project.name"
          value={project?.name ?? ''}
          required
          readOnly={readOnly}
          onChange={(v) => updateAttribute('name', v)}
          itemQueryIdentifier="projectName"
          additionalQueryArgs={{
            benefitPlanId: project?.benefitPlan?.id,
          }}
          action={projectNameValidationCheck}
          clearAction={projectNameValidationClear}
          setValidAction={projectNameSetValid}
          shouldValidate={(v) => shouldValidate(v, savedProjectName)}
          codeTakenLabel="project.name.alreadyTaken"
          isValid={isProjectNameValid}
          isValidating={isProjectNameValidating}
          validationError={projectNameValidationError}
        />
      </StyledGridItem>

      <StyledGridItem size={4}>
        <ActivityPicker
          label="project.activity"
          required
          withNull={false}
          readOnly={readOnly}
          value={project?.activity}
          onChange={(v) => updateAttribute('activity', v)}
        />
      </StyledGridItem>

      <StyledGridItem size={4}>
        <PublishedComponent
          pubRef="location.LocationCascader"
          module="socialProtection"
          label="Location"
          required
          withNull={false}
          readOnly={readOnly}
          value={project?.location}
          onChange={(v) => updateAttribute('location', v)}
        />
      </StyledGridItem>

      <StyledGridItem size={4}>
        <NumberInput
          module="socialProtection"
          label="project.targetBeneficiaries"
          required
          readOnly={readOnly}
          min={1}
          value={project?.targetBeneficiaries}
          onChange={(v) => updateAttribute('targetBeneficiaries', v)}
        />
      </StyledGridItem>

      <StyledGridItem size={4}>
        <NumberInput
          module="socialProtection"
          label="project.workingDays"
          required
          readOnly={readOnly}
          min={1}
          max={maxWorkingDays}
          value={project?.workingDays}
          onChange={(v) => updateAttribute('workingDays', v)}
        />
      </StyledGridItem>

      <StyledGridItem size={4}>
        <ProjectStatusPicker
          required
          readOnly={readOnly || isNewProject}
          value={project?.status || 'PREPARATION'}
          onChange={(v) => updateAttribute('status', v)}
          withNull={false}
        />
      </StyledGridItem>

      <StyledGridItem size={4}>
        <TextInput
          module="socialProtection"
          label="project.benefitPlan"
          value={project?.benefitPlan?.name ?? ''}
          readOnly
        />
      </StyledGridItem>
    </StyledGrid>
  );
}

const mapStateToProps = (state) => ({
  isProjectNameValid: state.socialProtection.validationFields?.projectName?.isValid,
  isProjectNameValidating: state.socialProtection.validationFields?.projectName?.isValidating,
  projectNameValidationError: state.socialProtection.validationFields?.projectName?.validationError,
  savedProjectName: state.socialProtection?.project?.name,
});

export { StyledGrid };
export default withModulesManager(injectIntl(
  connect(mapStateToProps)(ProjectHeadPanel),
));
