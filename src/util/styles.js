export const defaultPageStyles = (theme) => ({
  page: theme.page ?? {},
});

export const defaultFilterStyles = (theme) => ({
  form: {
    padding: 0,
    marginLeft: 0,
    paddingLeft: 0,
  },
  item: {
    padding: theme.spacing(1),
    paddingLeft: 0,
    marginLeft: 0,
  },
});

export const defaultHeadPanelStyles = (theme) => ({
  tableTitle: theme.table?.title ?? {},
  item: theme.paper?.item ?? {},
  fullHeight: {
    height: '100%',
  },
});

export const defaultDialogStyles = (theme) => ({
  item: theme.paper?.item ?? {},
});
