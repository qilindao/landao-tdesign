import { withInstall } from "@/landao/utils";
import basicForm from "./src/BasicForm";
export const LdForm = withInstall(basicForm);

export { useComponentRegister } from "./src/hooks/useComponentRegister";
export { useForm } from "./src/hooks/useForm";
