const { exec } = require("child_process");

module.exports = function execHandler({ command }) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(`ERROR: ${error.message}`);
      else if (stderr) reject(`ERROR: ${stderr}`);
      else return resolve(stdout);
    });
  });
};
