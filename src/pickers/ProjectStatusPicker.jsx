import React from 'react';
import { ConstantBasedPicker } from '@openimis/fe-core';
import { PROJECT_STATUS_LIST } from '../constants';

function ProjectStatusPicker(props) {
  const {
    required, readOnly, onChange, value, withLabel, withNull, nullLabel,
  } = props;

  return (
    <ConstantBasedPicker
      module="socialProtection"
      label="project.statusPicker"
      constants={PROJECT_STATUS_LIST}
      required={required}
      readOnly={readOnly}
      onChange={onChange}
      value={value}
      withLabel={withLabel}
      withNull={withNull}
      nullLabel={nullLabel}
    />
  );
}

export default ProjectStatusPicker;
