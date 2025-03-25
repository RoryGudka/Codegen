const { exec } = require("child_process");

const execHandler = ({ command }) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) resolve(`ERROR: ${error.message}`);
      else if (stderr) resolve(`ERROR: ${stderr}`);
      else return resolve(stdout);
    });
  });
};

module.exports = { execHandler };
