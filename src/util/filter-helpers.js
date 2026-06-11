import _debounce from 'lodash/debounce';
import { DEFAULT_DEBOUNCE_TIME, EMPTY_STRING } from '../constants';

export function createFilterHelpers(filters, onChangeFilters) {
  const debouncedOnChangeFilters = _debounce(onChangeFilters, DEFAULT_DEBOUNCE_TIME);

  const filterValue = (filterName) => filters?.[filterName]?.value;

  const filterTextFieldValue = (filterName) => filters?.[filterName]?.value ?? EMPTY_STRING;

  const onChangeStringFilter = (filterName, lookup = null) => (value) => {
    debouncedOnChangeFilters([
      {
        id: filterName,
        value,
        filter: lookup
          ? `${filterName}_${lookup}: "${value}"`
          : `${filterName}: "${value}"`,
      },
    ]);
  };

  return {
    debouncedOnChangeFilters,
    filterValue,
    filterTextFieldValue,
    onChangeStringFilter,
  };
}
