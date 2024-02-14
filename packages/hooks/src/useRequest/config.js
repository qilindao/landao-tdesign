const USEREQUEST_GLOBAL_OPTIONS = {};

export const USEREQUEST_GLOBAL_OPTIONS_PROVIDE_KEY = Symbol(
  "USEREQUEST_GLOBAL_OPTIONS_PROVIDE_KEY"
);

export const setGlobalOptions = (config) => {
  Object.keys(config).forEach((key) => {
    USEREQUEST_GLOBAL_OPTIONS[key] = config[key];
  });
};

export const getGlobalOptions = () => {
  return USEREQUEST_GLOBAL_OPTIONS;
};

export const clearGlobalOptions = () => {
  Object.keys(USEREQUEST_GLOBAL_OPTIONS).forEach((key) => {
    delete USEREQUEST_GLOBAL_OPTIONS[key];
  });
};
