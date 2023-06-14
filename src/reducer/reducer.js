const initialState = {
  socket: null,
  underlyingsData: null,
  derivativesData: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'OPEN_SOCKET_CONNECTION':
      return {
        socket: new WebSocket(action.params?.url),
      };
    case 'CLOSE_SOCKET_CONNECTION':
      return {
        socket: null,
      };
    case 'UPDATE_UNDERLYINGS_DATA':
      return {
        ...state,
        underlyingsData: action.params?.data
      }
    case 'UPDATE_DERIVATIVES_DATA':
      return {
        ...state,
        derivativesData: action.params?.data
      }
    default:
      return state;
  }
};

export default reducer;
