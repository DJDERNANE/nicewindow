import { DANGER, SUCCESS, WARNING, INFO } from '../styles/colors';
import i18n from '../../i18n';

export function setAppointmentStatus(status) {
  status = Number(status);

  switch (status) {
    case 0:
      return {
        label: i18n.t('status.appointments.pending'),
        color: WARNING,
      };
      break;

    case 1:
      return {
        label: i18n.t('status.appointments.progress'),
        color: INFO,
      };
      break;

    case 2:
      return {
        label: i18n.t('status.appointments.finished'),
        color: SUCCESS,
      };
      break;

    case 3:
      return {
        label: i18n.t('status.appointments.canceled'),
        color: DANGER,
      };
      break;

    default:
      return {
        label: i18n.t('status.appointments.pending'),
        color: WARNING,
      };
      break;
  }
}

export function setOrderStatus(status) {
  status = Number(status);

  switch (status) {
    case 0:
      return {
        label: 'Waiting',
        color: INFO,
      };
      break;

    case 1:
      return {
        label: 'En route',
        color: WARNING,
      };
      break;

    case 2:
      return {
        label: 'Finished',
        color: SUCCESS,
      };
      break;

    case 3:
      return {
        label: 'Canceled',
        color: DANGER,
      };
      break;

    default:
      break;
  }
}

export function setCanvasWidthHeight(width, height) {
  width = Number(width);
  height = Number(height);

  let operator = 1;

  if (width <= 250) {
    operator = operator;
  } else if (width > 250 && width <= 500) {
    operator = 2;
  } else if (width > 500 && width <= 900) {
    operator = 3;
  } else if (width > 900 && width <= 1500) {
    operator = 4.5;
  } else if (width > 1500 && width <= 2000) {
    operator = 6;
  } else if (width > 2000 && width <= 3000) {
    operator = 9;
  } else {
    operator = 20;
  }

  return {
    width: width / operator,
    height: height / operator,
  };
}
