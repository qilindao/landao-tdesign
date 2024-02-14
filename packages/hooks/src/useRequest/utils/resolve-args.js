export const withArgs = (hook, use) => {
  return function useRequestArgs(service, options = {}, plugins = []) {
    let next = hook;
    const middleware = use || [];
    for (let i = middleware.length; i--; ) {
      next = middleware[i](next);
    }
    return next(service, options, plugins);
  };
};
