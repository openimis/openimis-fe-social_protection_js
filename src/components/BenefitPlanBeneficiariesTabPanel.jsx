import React, { useState } from "react";
import {
  Grid,
  Tab,
  Button,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledGrid = styled(Grid)({
  '& .selected-tab': {
    borderBottom: '4px solid white',
  },
  '& .unselected-tab': {
    borderBottom: '4px solid transparent',
  },
});
import {
  Contributions,
  formatMessage,
  useHistory,
  useModulesManager,
  useTranslations,
} from "@openimis/fe-core";
import {
  MODULE_NAME,
  BENEFIT_PLAN_BENEFICIARIES_TAB_WRAPPER_VALUE,
  BENEFIT_PLAN_BENEFICIARIES_LIST_TAB_VALUE,
  BENEFIT_PLAN_BENEFICIARY_TABS_LABEL_CONTRIBUTION_KEY,
  BENEFIT_PLAN_BENEFICIARY_TABS_PANEL_CONTRIBUTION_KEY,
  DEDUPLICATION_SELECT_FIELD_DIALOG_CONTRIBUTION_KEY,
  PAYROLL_CREATE_RIGHTS_PUB_REF,
  PAYROLL_PAYROLL_ROUTE,
  RIGHT_BENEFIT_PLAN_UPDATE,
} from "../constants";
import BenefitPlanEligibilityCriteriaPanel from './BenefitPlanEligibilityCriteriaPanel';
import BenefitPlanBeneficiariesUploadDialog from "../dialogs/BenefitPlanBeneficiariesUploadDialog";
import BenefitPlanBeneficiariesUploadHistoryDialog from "../dialogs/BenefitPlanBeneficiariesUploadHistoryDialog";

function BenefitPlanBeneficiariesTabLabel({
  intl,
  onChange,
  tabStyle,
  isSelected,
}) {
  return (
    <Tab
      onChange={onChange}
      className={tabStyle(BENEFIT_PLAN_BENEFICIARIES_TAB_WRAPPER_VALUE)}
      selected={isSelected(BENEFIT_PLAN_BENEFICIARIES_TAB_WRAPPER_VALUE)}
      value={BENEFIT_PLAN_BENEFICIARIES_TAB_WRAPPER_VALUE}
      label={formatMessage(
        intl,
        "socialProtection",
        "benefitPlan.beneficiaries.tabGroup.label"
      )}
    />
  );
}

function BenefitPlanBeneficiariesTabPanel({
  intl,
  rights,
  benefitPlan,
  setConfirmedAction,
  value, confirmed,
  edited, onEditedChanged,
}) {
  if (value !== BENEFIT_PLAN_BENEFICIARIES_TAB_WRAPPER_VALUE) {
    return null;
  }

  const history = useHistory();
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const [activeTab, setActiveTab] = useState(
    BENEFIT_PLAN_BENEFICIARIES_LIST_TAB_VALUE
  );

  const isSelected = (tab) => tab === activeTab;
  const tabStyle = (tab) =>
    isSelected(tab) ? "selected-tab" : "unselected-tab";

  const handleChange = (_, tab) => {
    setActiveTab(tab);
  };

  const payrollCreateRights = modulesManager.getRef(PAYROLL_CREATE_RIGHTS_PUB_REF);

  const handleCreatePayrollButton = () => {
    history.push(
      `/${modulesManager.getRef(PAYROLL_PAYROLL_ROUTE)}/null/null/${benefitPlan.id}`
    );
  };

  return (
    <StyledGrid container>
      <Grid size={12} style={{ paddingLeft: "10px" }}>
        <div style={{ width: "100%" }}>
          <div style={{ float: "left" }}>
            <Contributions
              contributionKey={BENEFIT_PLAN_BENEFICIARY_TABS_LABEL_CONTRIBUTION_KEY}
              intl={intl}
              rights={rights}
              value={activeTab}
              onChange={handleChange}
              isSelected={isSelected}
              tabStyle={tabStyle}
            />
          </div>
          <div style={{ float: "right", paddingRight: "16px" }}>
            {rights.includes(payrollCreateRights) && (
              <Tooltip
                title={formatMessage(
                  "benefitPlan.benefitPlanTabPanel.createPayroll.tooltip"
                )}
                disableHoverListener={benefitPlan?.hasPaymentPlans}
              >
                <span>
                  <Button
                    onClick={handleCreatePayrollButton}
                    variant="outlined"
                    disabled={!benefitPlan?.hasPaymentPlans}
                    sx={{
                      border: 0,
                      marginTop: "6px",
                      backgroundColor: "#DFEDEF", // keep your old color
                      textTransform: "none",
                    }}
                  >
                    {formatMessage(
                      "benefitPlan.benefitPlanTabPanel.createPayroll"
                    )}
                  </Button>
                </span>
              </Tooltip>
            )}

            <Contributions
              contributionKey={DEDUPLICATION_SELECT_FIELD_DIALOG_CONTRIBUTION_KEY}
              intl={intl}
              benefitPlan={benefitPlan}
            />
            <BenefitPlanBeneficiariesUploadDialog benefitPlan={benefitPlan} />
            <BenefitPlanBeneficiariesUploadHistoryDialog
              benefitPlan={benefitPlan}
            />
          </div>
        </div>
      </Grid>
      <Grid size={12}>
        {rights.includes(RIGHT_BENEFIT_PLAN_UPDATE) && benefitPlan?.id && (
          <BenefitPlanEligibilityCriteriaPanel
            confirmed={confirmed}
            edited={edited}
            benefitPlan={benefitPlan}
            onEditedChanged={onEditedChanged}
            activeTab={activeTab}
          />
        )}
        <Contributions
          contributionKey={BENEFIT_PLAN_BENEFICIARY_TABS_PANEL_CONTRIBUTION_KEY}
          rights={rights}
          value={activeTab}
          benefitPlan={benefitPlan}
          setConfirmedAction={setConfirmedAction}
        />
      </Grid>
    </StyledGrid>
  );
}

export {
  BenefitPlanBeneficiariesTabLabel,
  BenefitPlanBeneficiariesTabPanel,
};
