const listeners = {};
const otherListeners = [];

const trigger = (key, data) => {
  if (listeners[key]) {
    listeners[key].forEach((item) => item(data));
    otherListeners.forEach((item) =>
      item({
        type: key,
        data,
      })
    );
  }
};

const subscribe = (key, listener) => {
  if (!listeners[key]) {
    listeners[key] = [];
  }
  listeners[key].push(listener);

  return function unsubscribe() {
    const index = listeners[key].indexOf(listener);
    listeners[key].splice(index, 1);
  };
};

const otherSubscribe = (listener) => {
  otherListeners.push(listener);
};

export { trigger, subscribe, otherSubscribe };
