/* eslint no-promise-executor-return: 0 */
function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  
  module.exports = delay;
  