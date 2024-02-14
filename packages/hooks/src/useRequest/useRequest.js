import useAutoRunPlugin from "./plugins/useAutoRunPlugin";
import useCachePlugin from "./plugins/useCachePlugin";
import useDebouncePlugin from "./plugins/useDebouncePlugin";
import useLoadingDelayPlugin from "./plugins/useLoadingDelayPlugin";
import usePollingPlugin from "./plugins/usePollingPlugin";
import useRefreshOnWindowFocusPlugin from "./plugins/useRefreshOnWindowFocusPlugin";
import useRetryPlugin from "./plugins/useRetryPlugin";
import useThrottlePlugin from "./plugins/useThrottlePlugin";

import useRequestImplement from "./useRequestImplement";

import { withArgs } from "./utils/resolve-args";

/**
 * @author https://github.com/InhiblabCore/vue-hooks-plus
 * @param {*} service 
 * @param {*} options 
 * @param {*} plugins 
 * @returns 
 */
function useRequest(service, options, plugins) {
  const BuiltInPlugins = [
    useDebouncePlugin,
    useLoadingDelayPlugin,
    usePollingPlugin,
    useRefreshOnWindowFocusPlugin,
    useThrottlePlugin,
    useAutoRunPlugin,
    useCachePlugin,
    useRetryPlugin,
  ]?.filter(Boolean);

  return withArgs(useRequestImplement, options?.use)(service, options, [
    ...(plugins || []),
    ...BuiltInPlugins,
  ]);
}

export default useRequest;
