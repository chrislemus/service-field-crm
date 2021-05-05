export const alertModalSuccess = (message) => {
  return { type: 'ALERT_MODAL_SUCCESS', payload: { message } };
};
export const alertModalInfo = (message) => {
  return { type: 'ALERT_MODAL_INFO', payload: { message } };
};
export const alertModalWarning = (message) => {
  return { type: 'ALERT_MODAL_WARNING', payload: { message } };
};
export const alertModalDanger = (message) => {
  return { type: 'ALERT_MODAL_DANGER', payload: { message } };
};
export const alertModalClear = () => {
  return { type: 'ALERT_MODAL_CLEAR' };
};
