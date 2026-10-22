// Criteria rows that can be turned into a filter. An empty row, saved with the
// others, was sent as "____=" and matched nothing (OP-3251).
export function completeCriteria(filters = []) {
  return filters.filter((row) => row?.field && row?.filter);
}

export function isBase64Encoded(str) {
  // Base64 encoded strings can only contain characters from [A-Za-z0-9+/=]
  const base64RegExp = /^[A-Za-z0-9+/=]+$/;
  return base64RegExp.test(str);
}
