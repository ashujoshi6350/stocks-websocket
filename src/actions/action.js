export const openSocketConnection = (params) => {
  return {
    type: 'OPEN_SOCKET_CONNECTION',
    params
  };
};

export const closeSocketConnection = () => {
  return {
    type: 'CLOSE_SOCKET_CONNECTION'
  };
};

export const updateUnderlyingsData = (params) => {
  return {
    type: 'UPDATE_UNDERLYINGS_DATA',
    params
  };
};

export const updateDerivativesData = (params) => {
  return {
    type: 'UPDATE_DERIVATIVES_DATA',
    params
  };
};
