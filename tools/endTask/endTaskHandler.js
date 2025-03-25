const endTaskHandler = ({ isSuccess }) => {
  if (isSuccess) {
    process.exit(0);
  } else {
    process.exit(1);
  }
};

module.exports = { endTaskHandler };
