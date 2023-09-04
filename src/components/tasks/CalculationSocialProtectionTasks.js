import React from 'react';
import { FormattedMessage } from '@openimis/fe-core';

const CalculationSocialProtectionTableHeaders = () => [
  <FormattedMessage module="socialProtection" id="bill.code" />,
  <FormattedMessage module="socialProtection" id="bill.name" />,
  <FormattedMessage module="socialProtection" id="bill.totalAmount" />,
  <FormattedMessage module="socialProtection" id="bill.dateValidFrom" />,
  <FormattedMessage module="socialProtection" id="bill.dateValidTo" />,
];

const CalculationSocialProtectionItemFormatters = () => [
  (bill) => bill?.code,
  (bill) => bill?.name,
  (bill) => bill?.totalAmount,
  (bill) => bill?.dateValidFrom,
  (bill) => bill?.dateValidTo,
];

export { CalculationSocialProtectionTableHeaders, CalculationSocialProtectionItemFormatters };
