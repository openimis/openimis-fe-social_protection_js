import messages_en from "./translations/en.json";
import reducer from "./reducer";
import BenefitPlanMainMenu from "./menus/BenefitPlanMainMenu";
import BenefitPlansPage from "./pages/BenefitPlansPage";

const ROUTE_BENEFIT_PLANS = "benefitPlans";
const ROUTE_BENEFIT_PLAN = "benefitPlans/benefitPlan";

const DEFAULT_CONFIG = {
    "translations": [{key: "en", messages: messages_en}],
    "reducers": [{key: "socialProtection", reducer}],
    "core.MainMenu": [BenefitPlanMainMenu],
    "core.Router": [
        {path: ROUTE_BENEFIT_PLANS, component: BenefitPlansPage},
        //{path: ROUTE_BENEFIT_PLAN + "/:benefit_plan_uuid?", component: BenefitPlanPage},
    ],
    "refs": [
        {key: "socialProtection.route.benefitPlan", ref: ROUTE_BENEFIT_PLAN},
    ]
}

export const SocialProtectionModule = (cfg) => {
    return {...DEFAULT_CONFIG, ...cfg};
}