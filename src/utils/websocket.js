import store from '../store/store';

let state = null;

const handleStoreUpdate = () => {
  state = store.getState();
};

store.subscribe(handleStoreUpdate);

export const subscribeToPrices = (socket, idsArr, callback, action, page) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error('WebSocket is not connected');
    return;
  }
  const message = {
    msg_command: "subscribe",
    data_type: "quote",
    tokens: idsArr
  };
  socket.send(JSON.stringify(message));
  socket.onmessage = event => {
    const data = JSON.parse(event.data);
    let newData;
    if (page === 'underlyings') {
      newData = state.underlyingsData?.map(item => {
        return item.token === data.payload.token ? { ...item, price: data.payload.price } : item
      })
    } else {
      newData = state.derivativesData?.map(item => {
        return item.token === data.payload.token ? { ...item, price: data.payload.price } : item
      })
    }
    callback(action({
      data: newData
    }));
  };
};

export const unSubscribePrices = (socket, idsArr) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error('WebSocket is not connected');
    return;
  }
  const message = {
    msg_command: "unsubscribe",
    data_type: "quote",
    tokens: idsArr
  };
  socket.send(JSON.stringify(message));
};
