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

## Dispatched Redux Actions
* `BENEFIT_PLAN_BENEFIT_PLANS_{REQ|RESP|ERR}` fetching BenefitPlans (as triggered by the searcher)
* `BENEFIT_PLAN_BENEFIT_PLAN_{REQ|RESP|ERR}` fetching chosen BenefitPlan
* `BENEFIT_PLAN_MUTATION_{REQ|ERR}`, sending a mutation
* `BENEFIT_PLAN_DELETE_BENEFIT_PLAN_RESP` receiving a result of delete BenefitPlan mutation
* `BENEFIT_PLAN_UPDATE_BENEFIT_PLAN_RESP` receiving a result of update BenefitPlan mutation
* `BENEFIT_PLAN_CODE_FIELDS_VALIDATION_{REQ|RESP|ERR}` receiving a result of validation of BenefitPlan code
* `BENEFIT_PLAN_NAME_FIELDS_VALIDATION_{REQ|RESP|ERR}` receiving a result of validation of BenefitPlan name
* `BENEFIT_PLAN_CODE_SET_VALID` setting a validity of BenefitPlan code in redux state
* `BENEFIT_PLAN_NAME_SET_VALID` setting a validity of BenefitPlan name in redux state

## Other Modules Listened Redux Actions
None

## Other Modules Redux State Bindings
* `state.core.user`, to access user info (rights,...)

## Configurations Options
None