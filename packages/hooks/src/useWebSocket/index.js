import { watch, ref, onUnmounted, unref, isRef } from "vue";

const ReadyState = {
  Connecting: 0,
  Open: 1,
  Closing: 2,
  Closed: 3,
};

/**
 * @param socketUrl socketUrl地址
 * @param options 配置
 * @return  readyState(Connecting = 0,Open = 1,Closing = 2,Closed = 3)
 */
export default function useWebSocket(socketUrl, options) {
  const {
    reconnectLimit = 3,
    reconnectInterval = 3 * 1000,
    manual = ref(false),
    onOpen,
    onClose,
    onMessage,
    onError,
    protocols,
  } = options;

  const reconnectTimesRef = ref(0);
  const reconnectTimerRef = ref();
  const websocketRef = ref();

  const unmountedRef = ref(false);

  const latestMessage = ref();
  const readyState = ref(ReadyState.Closed);

  const reconnect = () => {
    if (
      reconnectTimesRef.value < reconnectLimit &&
      websocketRef.value?.readyState !== ReadyState.Open
    ) {
      if (reconnectTimerRef.value) {
        clearTimeout(reconnectTimerRef.value);
      }

      reconnectTimerRef.value = setTimeout(() => {
        connectWs();
        reconnectTimesRef.value++;
      }, reconnectInterval);
    }
  };

  const connectWs = () => {
    if (reconnectTimerRef.value) {
      clearTimeout(reconnectTimerRef.value);
    }

    if (websocketRef.value) {
      websocketRef.value.close();
    }

    const ws = new WebSocket(unref(socketUrl), protocols);
    readyState.value = ReadyState.Connecting;

    ws.onerror = (event) => {
      if (unmountedRef.value) {
        return;
      }
      reconnect();
      onError?.(event, ws);
      readyState.value = ws.readyState || ReadyState.Closed;
    };
    ws.onopen = (event) => {
      if (unmountedRef.value) {
        return;
      }
      onOpen?.(event, ws);
      reconnectTimesRef.value = 0;
      readyState.value = ws.readyState || ReadyState.Open;
    };
    ws.onmessage = (message) => {
      if (unmountedRef.value) {
        return;
      }
      onMessage?.(message, ws);
      latestMessage.value = message;
    };
    ws.onclose = (event) => {
      if (unmountedRef.value) {
        return;
      }
      reconnect();
      onClose?.(event, ws);
      readyState.value = ws.readyState || ReadyState.Closed;
    };

    websocketRef.value = ws;
  };

  const sendMessage = (message) => {
    if (readyState.value === ReadyState.Open) {
      websocketRef.value?.send(message);
    } else {
      throw new Error("WebSocket disconnected");
    }
  };

  const connect = () => {
    reconnectTimesRef.value = 0;
    connectWs();
  };

  const disconnect = () => {
    if (reconnectTimerRef.value) {
      clearTimeout(reconnectTimerRef.value);
    }

    reconnectTimesRef.value = reconnectLimit;
    websocketRef.value?.close();
  };

  if (isRef(socketUrl) && isRef(manual))
    watch(
      [socketUrl, manual],
      (c) => {
        const [_, manualWatch] = c;
        if (!manualWatch) {
          connect();
        }
      },
      {
        immediate: true,
      }
    );
  else if (isRef(manual)) {
    watch(
      manual,
      (manualWatch) => {
        if (!manualWatch) {
          connect();
        }
      },
      {
        immediate: true,
      }
    );
  } else {
    if (!manual) {
      connect();
    }
  }

  onUnmounted(() => {
    unmountedRef.value = true;
    disconnect();
  });

  return {
    latestMessage: latestMessage,
    sendMessage,
    connect,
    disconnect,
    readyState,
    webSocketIns: websocketRef.value,
  };
}
