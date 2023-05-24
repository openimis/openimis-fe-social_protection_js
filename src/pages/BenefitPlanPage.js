import React, {useState, useRef, useEffect} from "react";
import {
    Form,
    withHistory,
    formatMessage,
    formatMessageWithValues,
    coreConfirm,
    journalize,
} from "@openimis/fe-core";
import {injectIntl} from "react-intl";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {withTheme, withStyles} from "@material-ui/core/styles";
import {RIGHT_BENEFIT_PLAN_UPDATE} from "../constants";
import {fetchBenefitPlan, deleteBenefitPlan, updateBenefitPlan} from "../actions";
import BenefitPlanHeadPanel from "../components/BenefitPlanHeadPanel";
import DeleteIcon from "@material-ui/icons/Delete";
import {ACTION_TYPE} from "../reducer";
import {isJsonString} from "../util/json-validate";

const styles = (theme) => ({
    page: theme.page,
});

const BenefitPlanPage = ({
                             intl,
                             classes,
                             rights,
                             history,
                             benefitPlanUuid,
                             benefitPlan,
                             fetchBenefitPlan,
                             deleteBenefitPlan,
                             updateBenefitPlan,
                             coreConfirm,
                             confirmed,
                             submittingMutation,
                             mutation,
                             journalize,
                         }) => {
    const [editedBenefitPlan, setEditedBenefitPlan] = useState({});
    const [confirmedAction, setConfirmedAction] = useState(() => null);
    const prevSubmittingMutationRef = useRef();

    useEffect(() => {
        if (!!benefitPlanUuid) {
            fetchBenefitPlan([`id: "${benefitPlanUuid}"`]);
        }
    }, [benefitPlanUuid]);

    useEffect(() => confirmed && confirmedAction(), [confirmed]);

    useEffect(() => {
        if (prevSubmittingMutationRef.current && !submittingMutation) {
            journalize(mutation);
            mutation?.actionType === ACTION_TYPE.DELETE_BENEFIT_PLAN && back();
        }
    }, [submittingMutation]);

    useEffect(() => {
        prevSubmittingMutationRef.current = submittingMutation;
    });

    useEffect(() => setEditedBenefitPlan(benefitPlan), [benefitPlan]);

    const back = () => history.goBack();

    const titleParams = (benefitPlan) => ({
        code: benefitPlan?.code,
        name: benefitPlan?.name
    });

    const isMandatoryFieldsEmpty = () => {
        if (editedBenefitPlan === undefined || editedBenefitPlan === null) {
            return false;
        }
        if (
            !!editedBenefitPlan.code &&
            !!editedBenefitPlan.name
        ) {
            return false;
        }
        return true;
    }

    const canSave = () => !isMandatoryFieldsEmpty() && isJsonString(editedBenefitPlan?.jsonExt);

    const handleSave = () => {
        updateBenefitPlan(
            editedBenefitPlan,
            formatMessageWithValues(intl, "socialProtection", "benefitPlan.update.mutationLabel", {
                code: benefitPlan?.code,
                name: benefitPlan?.name
            }),
        );
    };

    const deleteBenefitPlanCallback = () => deleteBenefitPlan(
        benefitPlan,
        formatMessageWithValues(intl, "socialProtection", "benefitPlan.delete.mutationLabel", {
            code: benefitPlan?.code,
            name: benefitPlan?.name
        }),
    );

    const openDeleteBenefitPlanConfirmDialog = () => {
        setConfirmedAction(() => deleteBenefitPlanCallback);
        coreConfirm(
            formatMessageWithValues(intl, "socialProtection", "benefitPlan.delete.confirm.title", {
                code: benefitPlan?.code,
                name: benefitPlan?.name
            }),
            formatMessage(intl, "socialProtection", "benefitPlan.delete.confirm.message"),
        );
    };

    const actions = [
        !!benefitPlan && {
            doIt: openDeleteBenefitPlanConfirmDialog,
            icon: <DeleteIcon/>,
            tooltip: formatMessage(intl, "socialProtection", "deleteButtonTooltip"),
        },
    ];

    return (
        rights.includes(RIGHT_BENEFIT_PLAN_UPDATE) && (
            <div className={classes.page}>
                <Form
                    module="socialProtection"
                    title={formatMessageWithValues(intl, "socialProtection", "benefitPlan.pageTitle", titleParams(benefitPlan))}
                    titleParams={titleParams(benefitPlan)}
                    openDirty={true}
                    benefitPlan={editedBenefitPlan}
                    edited={editedBenefitPlan}
                    onEditedChanged={setEditedBenefitPlan}
                    back={back}
                    mandatoryFieldsEmpty={isMandatoryFieldsEmpty}
                    canSave={canSave}
                    save={handleSave}
                    HeadPanel={BenefitPlanHeadPanel}
                    Panels={[]}
                    rights={rights}
                    actions={actions}
                    setConfirmedAction={setConfirmedAction}
                    saveTooltip={formatMessage(intl, "socialProtection", `benefitPlan.saveButton.tooltip.${canSave ? 'enabled' : 'disabled'}`)}
                />
            </div>
        )
    );
};

const mapStateToProps = (state, props) => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    benefitPlanUuid: props.match.params.benefit_plan_uuid,
    confirmed: state.core.confirmed,
    fetchingBenefitPlans: state.socialProtection.fetchingBenefitPlans,
    fetchedBenefitPlans: state.socialProtection.fetchedBenefitPlans,
    benefitPlan: state.socialProtection.benefitPlan,
    errorBenefitPlan: state.socialProtection.errorBenefitPlan,
    submittingMutation: state.socialProtection.submittingMutation,
    mutation: state.socialProtection.mutation,
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchBenefitPlan,
        deleteBenefitPlan,
        updateBenefitPlan,
        coreConfirm,
        journalize
    }, dispatch);
};

export default withHistory(
    injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(BenefitPlanPage)))),
);