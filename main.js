const { exec } = require("child_process");
const fs = require("fs");

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

    const promises = [];
    const res = [];

    for (const y of files) {
      let foundFlag = false;
      for (const x of objects) {
        if (x && y && !foundFlag) {
          const inspectCommand = `docker inspect ${x} | grep ${y.substring(0, 8)}`;
          const promise = new Promise((resolve, reject) => {
            exec(inspectCommand, (err, out, stderr) => {
              if (err) {
                resolve(); // Resolve even if there's an error
                return;
              }
              if (stderr) console.error(stderr);
              if (out) {
                foundFlag = true;
                resolve();
              }
            });
          });
          promises.push(promise);
        }
      }
      if (!foundFlag) {
        res.push(y);
        counter++;
      }
    }

    Promise.all(promises).then(() => {
      console.log({ unusedFolders: counter, names: res });
    });
  });
});
