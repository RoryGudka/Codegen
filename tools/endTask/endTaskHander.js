module.exports = function endTaskHandler({ isSuccess }) {
  if (isSuccess) {
    process.exit(0);
  } else {
    process.exit(1);
  }
};
