# openIMIS Frontend Social Protection module
This repository holds the files of the openIMIS Frontend Social Protection module.
It is dedicated to be bootstrap development of [openimis-fe_js](https://github.com/openimis/openimis-fe_js) modules, providing an empty (yet deployable) module.

Please refer to [openimis-fe_js](https://github.com/openimis/openimis-fe_js) to see how to build and deploy (in developement or server mode).

The module is built with [rollup](https://rollupjs.org/).
In development mode, you can use `npm link` and `npm start` to continuously scan for changes and automatically update your development server.

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/openimis/openimis-fe-social_protection_js.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/openimis/openimis-fe-social_protection_js/alerts/)

## Main Menu Contributions

  **Benefit Plans** (benefitPlan.menu.benefitPlans key), displayed if user has the right `160001`

## Other Contributions
* `core.Router`: registering `benefitPlans`, `benefitPlan`, routes in openIMIS client-side router

## Available Contribution Points
* `benefitPlan.TabPanel.label` labels for panels under Benefit Plan detail view
* `benefitPlan.TabPanel.panel` panels under Benefit Plan detail view
* `benefitPackage.TabPanel.label` labels for panels under Benefit Package detail view
* `benefitPackage.TabPanel.panel` panels under Benefit Package detail view

## Dispatched Redux Actions
* `BENEFIT_PLAN_BENEFIT_PLANS_{REQ|RESP|ERR}` fetching BenefitPlans (as triggered by the searcher)
* `BENEFIT_PLAN_BENEFIT_PLAN_{REQ|RESP|ERR}` fetching chosen BenefitPlan
* `BENEFIT_PLAN_MUTATION_{REQ|ERR}`, sending a mutation
* `BENEFIT_PLAN_DELETE_BENEFIT_PLAN_RESP` receiving a result of delete BenefitPlan mutation
* `BENEFIT_PLAN_UPDATE_BENEFIT_PLAN_RESP` receiving a result of update BenefitPlan mutation
* `GROUP_BENEFICIARY_UPDATE_GROUP_BENEFICIARY_RESP` receiving a result of update GroupBeneficiary mutation
* `BENEFICIARY_UPDATE_BENEFICIARY_RESP` receiving a result of update Beneficiary mutation
* `BENEFIT_PLAN_CODE_FIELDS_VALIDATION_{REQ|RESP|ERR}` receiving a result of validation of BenefitPlan code
* `BENEFIT_PLAN_NAME_FIELDS_VALIDATION_{REQ|RESP|ERR}` receiving a result of validation of BenefitPlan name
* `BENEFIT_PLAN_SCHEMA_FIELDS_VALIDATION_{REQ|RESP|ERR}` receiving a result of validation of BenefitPlan schema
* `BENEFIT_PLAN_CODE_SET_VALID` setting a validity of BenefitPlan code in redux state
* `BENEFIT_PLAN_NAME_SET_VALID` setting a validity of BenefitPlan name in redux state
* `BENEFIT_PLAN_SCHEMA_SET_VALID` setting a validity of BenefitPlan schema in redux state
* `BENEFICIARY_BENEFICIARIES_{REQ|RESP|ERR}` fetching Beneficiaries (as triggered by the searcher)
* `GROUP_BENEFICIARY_GROUP_BENEFICIARIES_{REQ|RESP|ERR}` fetching GroupBeneficiaries (as triggered by the searcher)
* `BENEFICIARY_BENEFICIARY_{REQ|RESP|ERR}` fetching chosen BenefitPlan
* `GROUP_BENEFICIARY_GET_GROUP_{REQ|RESP|ERR}` fetching chosen GroupBeneficiary
* `BENEFICIARY_EXPORT_{REQ|RESP|ERR}` export list of Beneficiaries
* `GROUP_BENEFICIARY_EXPORT_{REQ|RESP|ERR}` export list of GroupBeneficiaries
* `GET_WORKFLOWS_{REQ|RESP|ERR}` fetching list of Workflows
* `GET_BENEFIT_PLAN_UPLOAD_HISTORY_{REQ|RESP|ERR}` fetching list of historical wokflow actions
* `SEARCH_BENEFIT_PLAN_TASKS_{REQ|RESP|ERR}` fetching list of tasks related to BenefitPlan

## Other Modules Listened Redux Actions
None

## Other Modules Redux State Bindings
* `state.core.user`, to access user info (rights,...)
* `state.policyHolder`, to retrieve Policy Holders for their respective pickers

## Configurations Options
None
