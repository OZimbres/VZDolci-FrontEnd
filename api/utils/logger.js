/* eslint-env node */

const buildPayload = (level, message, context = {}) => ({
  level,
  message,
  timestamp: new Date().toISOString(),
  ...context
});

export const logger = {
  info(message, context) {
    console.log(JSON.stringify(buildPayload('info', message, context)));
  },
  warn(message, context) {
    console.warn(JSON.stringify(buildPayload('warn', message, context)));
  },
  error(message, context) {
    console.error(JSON.stringify(buildPayload('error', message, context)));
  }
};
