import React, { useState, useEffect } from "react";
import { Paper, Fab, makeStyles } from '@material-ui/core';
import { fetchPendingBeneficiaryUploads, resolveTask } from '../../actions';
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Table, coreConfirm, SelectDialog } from "@openimis/fe-core";
import { Grid, Checkbox, FormControlLabel, Divider, GridItem } from "@material-ui/core";
import { TASK_STATUS, APPROVED, FAILED } from "../../constants";
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';

import {
    withModulesManager,
    decodeId,
    PublishedComponent,
    ControlledField,
    TextInput,
    formatMessage,
    formatMessageWithValues,
  } from "@openimis/fe-core";
import { useIntl } from "react-intl";


const useStyles = makeStyles((theme) => ({
  paper: theme.paper.paper,
  title: theme.paper.title,
  button: theme.paper.button,
  fabContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  fabHeaderContainer: {
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  fab: {
    margin: theme.spacing(1),
  },

}));

function BeneficiaryUploadTaskDisplay({
  businessData, setAdditionalData, jsonExt
}) {


  const {
    errorPendingBeneficiaries, 
    pendingBeneficiaries, 
    fetchedPendingBeneficiaries, 
    fetchingPendingBeneficiaries,
    pendingBeneficiariesPageInfo
} = useSelector((state) => state.socialProtection);
const intl = useIntl();
  const [pending, setPending] = useState([]);
  const [keys, setKeys] = useState([]);
  const [state, setState] = useState({
    page: 0,
    pageSize: 10,
    afterCursor: null,
    beforeCursor: null,
  })

  const isTaskResolved = () => ![TASK_STATUS.RECEIVED, TASK_STATUS.ACCEPTED].includes(task?.status)
  const dispatch = useDispatch()
  const queryPrms = () => { 
    return {
    'upload_Id': jsonExt?.data_upload_id, 
    'isDeleted': isTaskResolved()  ? undefined : false 
  }}

  const {task} = useSelector((state) => state.tasksManagement)
  const currentUser = useSelector((state) => state.core.user)


  const [selectedRecords, setSelectedRecords] = useState([])
  const query = () => {
    let prms = queryPrms();
    if (!state.pageSize || !prms) return;
    prms.pageSize = state.pageSize;
    if (!!state.afterCursor) {
      prms.after = state.afterCursor;
    }
    if (!!state.beforeCursor) {
      prms.before = state.beforeCursor;
    }

    dispatch(fetchPendingBeneficiaryUploads(prms));
  };

  const currentPage = () => state.page;
  const currentPageSize = () => state.pageSize;

  useEffect(() => {
    query()
  }, []);

  useEffect(() => {
    query()
  }, [state]);

  const organizeData = (data) => {
    let uniqueKeys = ['last_name', 'first_name', 'dob'];

    data.forEach(i => Object.keys(i).forEach(k =>{
        if (!uniqueKeys.includes(k)) {
            uniqueKeys.push(k)
        }
    }));

    // Remove internal identifiers
    // Unnamed 0 is ordinal often found in the uploaded CSVs, it shoun't appear in new 
    // version but is added for backward compatibility s
    return uniqueKeys.filter(k => !['uuid', 'ID', 'Unnamed: 0'].includes(k))
  }

  const [storedIndividuals, setStoredIndividuals] = useState({})

  useEffect(() => {
    setPending(pendingBeneficiaries.map(x => x.jsonExt? {...JSON.parse(x.jsonExt), uuid: x.uuid}: {uuid: x.uuid}))
    let withIndividuals = {}
    pendingBeneficiaries.map(x => withIndividuals[x.id] = x.individual?.id)
    setStoredIndividuals(withIndividuals)
}, [pendingBeneficiaries]);

  useEffect(() => setKeys(organizeData(pending)), [pending])



  const classes = useStyles();
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
    task?.status === TASK_STATUS.ACCEPTED ? 
        formatMessage(intl, "socialProtection", "selectForEvaluation") : formatMessage(intl, "socialProtection", "evaluated"),
    ...keys] || [];

  const changeCheckboxState = (pending) => {
    setSelectedRecords(selectedRecords.includes(pending.uuid) ? 
        selectedRecords.filter(x => x !== pending.uuid) : [...selectedRecords, pending.uuid]
    )
  }

  const itemFormatters = () => {
    let items = [
    (pending) => (<>
        {!isTaskResolved() ? <Checkbox
        color="primary"
        checked={selectedRecords.includes(pending.uuid)}
        onChange={(event) => changeCheckboxState(pending)}
        disabled={isRowDisabled()}
        /> : <Checkbox
        color="primary"
        checked={storedIndividuals[pending.uuid] != undefined}
        onChange={(event) => {}}
        disabled={true}
        />}
        
      </>)
    ];

    keys.map(key => items.push((pending) => pending.hasOwnProperty(key) ? pending[key] : "-"));
    return items;
  }

  const onChangeRowsPerPage = (rows) => {
    setState({
        ...state,
        pageSize:rows
    })
  }
  
  const onChangeSelection = (rows) => {
    setSelectedRecords(rows.map(row => row.uuid))
  }

  const onChangePage = (page, nbr) => {
    const next = nbr > state.page

    setState(
        {
            page: next ? state.page+1 : state.page-1,
            pageSize: state.pageSize,
            afterCursor: next ? pendingBeneficiariesPageInfo.endCursor : null,
            beforeCursor: !next ? pendingBeneficiariesPageInfo.startCursor : null,
        }
    )
  }

  const isCurrentUserInTaskGroup = () => {
    const taskExecutors = task?.taskGroup?.taskexecutorSet?.edges.map((edge) => decodeId(edge.node.user.id)) ?? [];
    return taskExecutors && taskExecutors.includes(currentUser?.id);
  };

  const isRowDisabled = (_) => {
    return !isCurrentUserInTaskGroup() || task?.status !== TASK_STATUS.ACCEPTED
  }


  const [approveOrFail, setApproveOrFail] = useState('');
  const [confirmed, setConfirmed] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const [disabled, setDisable] = useState(false)

  const clear = () => {
    setOpenModal(null);
    setApproveOrFail('');
    setConfirmed('');
}

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
  }

  const onClose = () => {
    setOpenModal(false);
    setConfirmed(false);
  }

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
            confirmMessage={formatMessageWithValues(intl, "socialProtection", "atomicApprove", { count: selectedRecords.length })}
            confirmationButton="dialogActions.continue"
            rejectionButton="dialogActions.goBack"
        />
      <Table
          module="socialProtection"
          headers={headers()}
          //headerActions={headerActions}
          itemFormatters={itemFormatters()}
          items={(!!pending && pending) || []}
          fetching={fetchingPendingBeneficiaries}
          error={errorPendingBeneficiaries}
          //onDoubleClick={this.onDoubleClick}
          withSelection={!isRowDisabled() ? "multiple" : ''}
          onChangeSelection={onChangeSelection}
          withPagination={true}
          rowsPerPageOptions={[10, 20, 10, 100]}
          defaultPageSize={10}
          page={currentPage()}
          pageSize={currentPageSize()}
          count={ pendingBeneficiariesPageInfo.totalCount }
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
          rowDisabled={isRowDisabled}
          //rowLocked={isRowDisabled}
        />
    
    {isCurrentUserInTaskGroup() && 
    <>    <Paper className={classes.paper}>
        <div className={classes.fabHeaderContainer}>
        {formatMessage(intl, 'socialProtection', 'resolveSelectedTasks' )}
        <Divider/>
        </div>
      <div className={classes.fabContainer}>
        <div className={classes.fab}>
          <Fab
            color="primary"
            disabled={disabled || task?.status === TASK_STATUS.RECEIVED || isRowDisabled() || selectedRecords.length === 0}
            onClick={() => handleButtonClick("ACCEPT")}
          >
            <CheckIcon />
          </Fab>
        {formatMessage(intl, 'socialProtection', 'acceptSelected' )}
        </div>
        <div className={classes.fab}>
          <Fab
            color="primary"
            disabled={disabled || task?.status === TASK_STATUS.RECEIVED || isRowDisabled() || selectedRecords.length === 0}
            onClick={() => handleButtonClick("REJECT")}
          >
            <ClearIcon />
          </Fab>
        {formatMessage(intl, 'socialProtection', 'rejectSelected' )}
        </div>
      </div>
    </Paper>
    </>
}
    </>
  );
}

const UploadResolutionTaskTableHeaders = () => [];

const UploadResolutionItemFormatters = () => [
  (businessData, jsonExt, formatterIndex, setAdditionalData) => (
    <>
    <BeneficiaryUploadTaskDisplay
      businessData={businessData}
      setAdditionalData={setAdditionalData}
      jsonExt={jsonExt}
    />
    </>
  ),
];

const UploadConfirmationPanel = ({defaultAction, defaultDisabled}) => {
    const intl = useIntl();
    const classes = useStyles();
    const {task} = useSelector((state) => state.tasksManagement)
    const currentUser = useSelector((state) => state.core.user)
    const [disabled, setDisable] = useState(defaultDisabled)

    const [openModal, setOpenModal] = useState(null);
    const [approveOrFail, setApproveOrFail] = useState('');
    const [confirmed, setConfirmed] = useState('')
    

    const onConfirm = () => {
        setOpenModal(false);
        setConfirmed(true);
      }
    
      const onClose = () => {
        setOpenModal(false);
        setConfirmed(false);
      }

    const isCurrentUserInTaskGroup = () => {
        const taskExecutors = task?.taskGroup?.taskexecutorSet?.edges.map((edge) => decodeId(edge.node.user.id)) ?? [];
        return taskExecutors && taskExecutors.includes(currentUser?.id);
      };
    
    const isRowDisabled = (_) => {
        return !isCurrentUserInTaskGroup() || task?.status !== TASK_STATUS.ACCEPTED
    }

    const clear = () => {
        setOpenModal(null);
        setApproveOrFail('');
        setConfirmed('');
    }


    const handleButtonClick = (choiceString) => {
        // () => defaultAction(APPROVED)
        if (task?.id && currentUser?.id) {
          setApproveOrFail(choiceString);
          setOpenModal(true);
        }
    };

    const dispatch = useDispatch()

    useEffect(() => {
        if (task?.id && currentUser?.id) {
          if (confirmed) {
            setDisable(true);
            dispatch(resolveTask(
              task,
              formatMessage(intl, 'tasksManagement', 'task.resolve.mutationLabel'),
              currentUser,
              approveOrFail
              
            ));
          }
        }
        return () => confirmed && clear();
      }, [confirmed]);
    

    return (<>
            <SelectDialog
            confirmState={openModal}
            onConfirm={onConfirm}
            onClose={onClose}
            module="socialProtection"
            confirmTitle="taskConfirmation.title"
            confirmMessage={formatMessage(intl, "socialProtection", "bulkApprove")}
            confirmationButton="dialogActions.continue"
            rejectionButton="dialogActions.goBack"
        />
        <Paper className={classes.paper}>
    <div className={classes.fabHeaderContainer}>
    {formatMessage(intl, 'socialProtection', 'resolveAllRemainingTasks' )}
    <Divider/>
    </div>
    <div className={classes.fabContainer}>
        <div className={classes.fab}>
                <Fab
            color="primary"
            disabled={disabled || isRowDisabled()}
            onClick={() => handleButtonClick(APPROVED)}
          >
            <CheckIcon />
          </Fab>
        {formatMessage(intl, 'socialProtection', 'approveAll' )}

        </div>
        <div className={classes.fab}>
          <Fab
            color="primary"
            disabled={disabled || task?.status === TASK_STATUS.RECEIVED || isRowDisabled()}
            onClick={() => handleButtonClick(FAILED)}
          >
            <ClearIcon />
          </Fab>
        {formatMessage(intl, 'socialProtection', 'rejectAll' )}
        </div></div>
    </Paper>
    </>
        )

}

export { UploadResolutionTaskTableHeaders, UploadResolutionItemFormatters, UploadConfirmationPanel };
