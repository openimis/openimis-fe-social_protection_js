/* eslint-disable eqeqeq */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
/* eslint-disable no-return-assign */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Paper, Fab, Grid, Checkbox, FormControlLabel, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  Table, coreConfirm, SelectDialog,
  withModulesManager,
  decodeId,
  PublishedComponent,
  ControlledField,
  TextInput,
  formatMessage,
  formatMessageWithValues,
} from '@openimis/fe-core';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';

import { useIntl } from 'react-intl';
import { TASK_STATUS, APPROVED, FAILED } from '../../constants';
import { fetchPendingBeneficiaryUploads, resolveTask } from '../../actions';

const StyledPaper = styled(Paper)(({ theme }) => ({
  ...theme.paper?.paper ?? {},
}));

const StyledFabContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
});

const StyledFabHeaderContainer = styled('div')({
  justifyContent: 'center',
  textAlign: 'center',
  fontSize: '16px',
  fontWeight: 'bold',
});

const StyledFab = styled('div')(({ theme }) => ({
  margin: theme.spacing(1),
}));

function BeneficiaryUploadTaskDisplay({
  businessData, setAdditionalData, jsonExt,
}) {
  const {
    errorPendingBeneficiaries,
    pendingBeneficiaries,
    fetchedPendingBeneficiaries,
    fetchingPendingBeneficiaries,
    pendingBeneficiariesPageInfo,
  } = useSelector((state) => state.socialProtection);
  const intl = useIntl();
  const [pending, setPending] = useState([]);
  const [keys, setKeys] = useState([]);
  const [state, setState] = useState({
    page: 0,
    pageSize: 10,
    afterCursor: null,
    beforeCursor: null,
  });

  const isTaskResolved = () => ![TASK_STATUS.RECEIVED, TASK_STATUS.ACCEPTED].includes(task?.status);
  const dispatch = useDispatch();
  const queryPrms = () => ({
    upload_Id: jsonExt?.data_upload_id,
    isDeleted: isTaskResolved() ? undefined : false,
  });

  const { task } = useSelector((state) => state.tasksManagement);
  const currentUser = useSelector((state) => state.core.user);

  const [selectedRecords, setSelectedRecords] = useState([]);
  const query = () => {
    const prms = queryPrms();
    if (!state.pageSize || !prms) return;
    prms.pageSize = state.pageSize;
    if (state.afterCursor) {
      prms.after = state.afterCursor;
    }
    if (state.beforeCursor) {
      prms.before = state.beforeCursor;
    }

    dispatch(fetchPendingBeneficiaryUploads(prms));
  };

  const currentPage = () => state.page;
  const currentPageSize = () => state.pageSize;

  useEffect(() => {
    query();
  }, []);

  useEffect(() => {
    query();
  }, [state]);

  const organizeData = (data) => {
    const uniqueKeys = ['last_name', 'first_name', 'dob'];

    data.forEach((i) => Object.keys(i).forEach((k) => {
      if (!uniqueKeys.includes(k)) {
        uniqueKeys.push(k);
      }
    }));

    // Remove internal identifiers
    // Unnamed 0 is ordinal often found in the uploaded CSVs, it shoun't appear in new
    // version but is added for backward compatibility s
    return uniqueKeys.filter((k) => !['uuid', 'ID', 'Unnamed: 0'].includes(k));
  };

  const [storedIndividuals, setStoredIndividuals] = useState({});

  useEffect(() => {
    // eslint-disable-next-line max-len
    setPending(pendingBeneficiaries.map((x) => (x.jsonExt ? { ...JSON.parse(x.jsonExt), uuid: x.uuid } : { uuid: x.uuid })));
    const withIndividuals = {};
    pendingBeneficiaries.map((x) => withIndividuals[x.id] = x.individual?.id);
    setStoredIndividuals(withIndividuals);
  }, [pendingBeneficiaries]);

  useEffect(() => setKeys(organizeData(pending)), [pending]);


  const beneficiaryUuids = (businessData?.ids || []).map((id) => id.uuid);
  const beneficiaries = (businessData?.ids || []).map((id) => {
    // eslint-disable-next-line camelcase
    const { individual, json_ext, ...rest } = id;
    return {
      ...rest,
      ...individual,
      // eslint-disable-next-line camelcase
      ...json_ext,
      individual: individual.uuid,
    };
  });

  const headers = () => [
    task?.status === TASK_STATUS.ACCEPTED
      ? formatMessage(intl, 'socialProtection', 'selectForEvaluation') : formatMessage(intl, 'socialProtection', 'evaluated'),
    ...keys] || [];

  const changeCheckboxState = (pending) => {
    setSelectedRecords(selectedRecords.includes(pending.uuid)
      ? selectedRecords.filter((x) => x !== pending.uuid) : [...selectedRecords, pending.uuid]);
  };

  const itemFormatters = () => {
    const items = [
      (pending) => (
        <>
          {!isTaskResolved() ? (
            <Checkbox
              color="primary"
              checked={selectedRecords.includes(pending.uuid)}
              onChange={(event) => changeCheckboxState(pending)}
              disabled={isRowDisabled()}
            />
          ) : (
            <Checkbox
              color="primary"
              checked={storedIndividuals[pending.uuid] != undefined}
              onChange={(event) => {}}
              disabled
            />
          )}

        </>
      ),
    ];

    keys.map((key) => items.push((pending) => (pending.hasOwnProperty(key) ? pending[key] : '-')));
    return items;
  };

  const onChangeRowsPerPage = (rows) => {
    setState({
      ...state,
      pageSize: rows,
    });
  };

  const onChangeSelection = (rows) => {
    setSelectedRecords(rows.map((row) => row.uuid));
  };

  const onChangePage = (page, nbr) => {
    const next = nbr > state.page;

    setState(
      {
        page: next ? state.page + 1 : state.page - 1,
        pageSize: state.pageSize,
        afterCursor: next ? pendingBeneficiariesPageInfo.endCursor : null,
        beforeCursor: !next ? pendingBeneficiariesPageInfo.startCursor : null,
      },
    );
  };

  const isCurrentUserInTaskGroup = () => {
    const taskExecutors = task?.taskGroup?.taskexecutorSet?.edges.map((edge) => decodeId(edge.node.user.id)) ?? [];
    return taskExecutors && taskExecutors.includes(currentUser?.id);
  };

  const isRowDisabled = (_) => !isCurrentUserInTaskGroup() || task?.status !== TASK_STATUS.ACCEPTED;

  const [approveOrFail, setApproveOrFail] = useState('');
  const [confirmed, setConfirmed] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const [disabled, setDisable] = useState(false);

  const clear = () => {
    setOpenModal(null);
    setApproveOrFail('');
    setConfirmed('');
  };

  useEffect(() => {
    if (task?.id && currentUser?.id) {
      if (confirmed) {
        setDisable(true);
        dispatch(resolveTask(
          task,
          formatMessage(intl, 'tasksManagement', 'task.resolve.mutationLabel'),
          currentUser,
          approveOrFail,
          selectedRecords,
        ));
      }
    }
    return () => confirmed && clear(false);
  }, [confirmed]);

  const onConfirm = () => {
    setOpenModal(false);
    setConfirmed(true);
  };

  const onClose = () => {
    setOpenModal(false);
    setConfirmed(false);
  };

  const handleButtonClick = (choiceString) => {
    if (task?.id && currentUser?.id) {
      setApproveOrFail(choiceString);
      setOpenModal(true);
    }
  };

  return (
    <>
      <SelectDialog
        confirmState={openModal}
        onConfirm={onConfirm}
        onClose={onClose}
        module="socialProtection"
        confirmTitle="taskConfirmation.title"
        confirmMessage={formatMessageWithValues(intl, 'socialProtection', 'atomicApprove', { count: selectedRecords.length })}
        confirmationButton="dialogActions.continue"
        rejectionButton="dialogActions.goBack"
      />
      <Table
        module="socialProtection"
        headers={headers()}
          // headerActions={headerActions}
        itemFormatters={itemFormatters()}
        items={(!!pending && pending) || []}
        fetching={fetchingPendingBeneficiaries}
        error={errorPendingBeneficiaries}
          // onDoubleClick={this.onDoubleClick}
        withSelection={!isRowDisabled() ? 'multiple' : ''}
        onChangeSelection={onChangeSelection}
        withPagination
        rowsPerPageOptions={[10, 20, 10, 100]}
        defaultPageSize={10}
        page={currentPage()}
        pageSize={currentPageSize()}
        count={pendingBeneficiariesPageInfo.totalCount}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        rowDisabled={isRowDisabled}
      />

      {isCurrentUserInTaskGroup()
    && (
    <>
      {' '}
      <StyledPaper>
        <StyledFabHeaderContainer>
          {formatMessage(intl, 'socialProtection', 'resolveSelectedTasks')}
          <Divider />
        </StyledFabHeaderContainer>
        <StyledFabContainer>
          <StyledFab>
            <Fab
              color="primary"
              disabled={disabled || task?.status === TASK_STATUS.RECEIVED || isRowDisabled() || selectedRecords.length === 0}
              onClick={() => handleButtonClick('ACCEPT')}
            >
              <CheckIcon />
            </Fab>
            {formatMessage(intl, 'socialProtection', 'acceptSelected')}
          </StyledFab>
          <StyledFab>
            <Fab
              color="primary"
              disabled={disabled || task?.status === TASK_STATUS.RECEIVED || isRowDisabled() || selectedRecords.length === 0}
              onClick={() => handleButtonClick('REJECT')}
            >
              <ClearIcon />
            </Fab>
            {formatMessage(intl, 'socialProtection', 'rejectSelected')}
          </StyledFab>
        </StyledFabContainer>
      </StyledPaper>
    </>
    )}
    </>
  );
}

const UploadResolutionTaskTableHeaders = () => [];

const UploadResolutionItemFormatters = () => [
  (businessData, jsonExt, formatterIndex, setAdditionalData) => (
    <BeneficiaryUploadTaskDisplay
      businessData={businessData}
      setAdditionalData={setAdditionalData}
      jsonExt={jsonExt}
    />
  ),
];

function UploadConfirmationPanel({ defaultAction, defaultDisabled }) {
  const intl = useIntl();

  const { task } = useSelector((state) => state.tasksManagement);
  const currentUser = useSelector((state) => state.core.user);
  const [disabled, setDisable] = useState(defaultDisabled);

  const [openModal, setOpenModal] = useState(null);
  const [approveOrFail, setApproveOrFail] = useState('');
  const [confirmed, setConfirmed] = useState('');

  const onConfirm = () => {
    setOpenModal(false);
    setConfirmed(true);
  };

  const onClose = () => {
    setOpenModal(false);
    setConfirmed(false);
  };

  const isCurrentUserInTaskGroup = () => {
    const taskExecutors = task?.taskGroup?.taskexecutorSet?.edges.map((edge) => decodeId(edge.node.user.id)) ?? [];
    return taskExecutors && taskExecutors.includes(currentUser?.id);
  };

  const isRowDisabled = (_) => !isCurrentUserInTaskGroup() || task?.status !== TASK_STATUS.ACCEPTED;

  const clear = () => {
    setOpenModal(null);
    setApproveOrFail('');
    setConfirmed('');
  };

  const handleButtonClick = (choiceString) => {
    // () => defaultAction(APPROVED)
    if (task?.id && currentUser?.id) {
      setApproveOrFail(choiceString);
      setOpenModal(true);
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (task?.id && currentUser?.id) {
      if (confirmed) {
        setDisable(true);
        dispatch(resolveTask(
          task,
          formatMessage(intl, 'tasksManagement', 'task.resolve.mutationLabel'),
          currentUser,
          approveOrFail,

        ));
      }
    }
    return () => confirmed && clear();
  }, [confirmed]);

  return (
    <>
      <SelectDialog
        confirmState={openModal}
        onConfirm={onConfirm}
        onClose={onClose}
        module="socialProtection"
        confirmTitle="taskConfirmation.title"
        confirmMessage={formatMessage(intl, 'socialProtection', 'bulkApprove')}
        confirmationButton="dialogActions.continue"
        rejectionButton="dialogActions.goBack"
      />
      <StyledPaper>
        <StyledFabHeaderContainer>
          {formatMessage(intl, 'socialProtection', 'resolveAllRemainingTasks')}
          <Divider />
        </StyledFabHeaderContainer>
        <StyledFabContainer>
          <StyledFab>
            <Fab
              color="primary"
              disabled={disabled || isRowDisabled()}
              onClick={() => handleButtonClick(APPROVED)}
            >
              <CheckIcon />
            </Fab>
            {formatMessage(intl, 'socialProtection', 'approveAll')}

          </StyledFab>
          <StyledFab>
            <Fab
              color="primary"
              disabled={disabled || task?.status === TASK_STATUS.RECEIVED || isRowDisabled()}
              onClick={() => handleButtonClick(FAILED)}
            >
              <ClearIcon />
            </Fab>
            {formatMessage(intl, 'socialProtection', 'rejectAll')}
          </StyledFab>
        </StyledFabContainer>
      </StyledPaper>
    </>
  );
}

export { UploadResolutionTaskTableHeaders, UploadResolutionItemFormatters, UploadConfirmationPanel };
