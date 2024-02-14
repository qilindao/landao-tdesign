import { provide } from "vue";

import { USEREQUEST_GLOBAL_OPTIONS_PROVIDE_KEY } from "./config";

export default function useRequestProvider(config) {
  provide(USEREQUEST_GLOBAL_OPTIONS_PROVIDE_KEY, config);
}
