import { LoggerService } from '../../../../src/common/modules/logger/logger.service';

export const log = jest.fn(() => {
  return;
});
export const debug = jest.fn(() => {
  return;
});
export const error = jest.fn(() => {
  return;
});
export const warn = jest.fn(() => {
  return;
});
export const info = jest.fn(() => {
  return;
});
export const silly = jest.fn(() => {
  return;
});
export const crit = jest.fn(() => {
  return;
});

export const LoggerServiceMock = jest.fn(() => {
  return {
    log,
    error,
    debug,
    warn,
    info,
    silly,
    crit,
    traceId: '',
  };
});

export const MockLoggerService = {
  provide: LoggerService,
  useClass: LoggerServiceMock,
};
