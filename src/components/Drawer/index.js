import { withInstall } from "@/landao/utils";
import basicDrawer from "./src/BasicDrawer";
export const LdDrawer = withInstall(basicDrawer);
export { useDrawer, useDrawerInner } from "./src/useDrawer";
