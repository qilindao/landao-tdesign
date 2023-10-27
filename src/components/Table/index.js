import { withInstall } from "@/landao/utils";
import basicTable from "./src/BasicTable";

export { default as TableAction } from "./src/components/TableAction";
export const LdTable = withInstall(basicTable);

export { useTable } from "./src/hooks/useTable";
