import { Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export const defaultPageStyles = (theme) => ({
  page: theme.page ?? {},
});

export const defaultFilterStyles = (theme) => ({
  form: {
    padding: theme.spacing(1),
  },
  item: {
    padding: theme.spacing(0.5),
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

// Tab visual states (selected/unselected indicator + hover overlay).
// Bare <Tab> outside a <Tabs> wrapper doesn't get MUI's default hover, so
// we add `theme.palette.action.hover` ourselves.
export const tabStyles = (theme) => ({
  '& .selected, & .unselected': {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  '& .selected': {
    borderBottom: '4px solid white',
  },
  '& .unselected': {
    borderBottom: '4px solid transparent',
  },
});

export const TabBarPaper = styled(Paper)(({ theme }) => ({
  ...theme.paper?.paper ?? {},
}));

export const TabBarGrid = styled(Grid)(({ theme }) => ({
  ...theme.table?.title ?? {},
  display: 'flex',
  alignItems: 'center',
  ...tabStyles(theme),
}));
