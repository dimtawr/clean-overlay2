const util = require("util");
const { exec } = require("child_process");
const fs = require("fs");
const execPromise = util.promisify(exec);

let counter = 0;
fs.readdir("/var/lib/docker/overlay2/", (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  exec("docker ps", (err, stdout, stderr) => {
    if (err) {
      console.error("Error executing 'docker ps' command:", err);
      return;
    }

    const list = stdout.split("\n");
    let objects = list.map((x) => x.substring(0, 12));
    objects[0] = undefined; // clean first element "CONTAINER ID"

    const res = [];

    console.log("Files:", files.length);

    Promise.all(
      files.map(async (y) => {
        if (y.length > 10) {
          let foundFlag = false;
          await Promise.all(
            objects.map(async (x) => {
              if (x && y && !foundFlag) {
                const inspectCommand = `docker inspect ${x} | grep ${y}`;
                try {
                  const { stdout, stderr } = await execPromise(inspectCommand);
                  if (stdout) {
                    foundFlag = true;
                    y = undefined;
                  }
                } catch (error) {
                  return;
                }
              }
            }),
          ).then(() => {
            if (!foundFlag) {
              res.push(y);
              counter++;
            }
          });
        }
      }),
    ).then(() => {
      console.log({ unusedFolders: counter, names: res });
    });
  });
});
