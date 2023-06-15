import React from 'react';
import { TextInput, NumberInput } from '@openimis/fe-core';
import { FIELD_TYPES } from '../constants';

export const createAdditionalField = (jsonExt) => {
  if (!jsonExt) return [];

  const additionalFields = JSON.parse(jsonExt);

  return Object.entries(additionalFields).map(([property, value]) => {
    const field = { [property]: value };
    const fieldType = typeof value;
    return { fieldType, field };
  });
};

export const renderProperType = ({ fieldType, field }) => {
  const { 0: label, 1: value } = Object.entries(field)[0];

  if (fieldType === FIELD_TYPES.INTEGER || fieldType === FIELD_TYPES.NUMBER) {
    return (
      <NumberInput
        module="socialProtection"
        readOnly
        min={0}
        displayZero
        label={label}
        value={value}
      />
    );
  }

  return (
    <TextInput
      module="socialProtection"
      readOnly
      label={label}
      value={value}
    />
  );
};
