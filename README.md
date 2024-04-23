
-- There is an issue with `docker prune` not clearing unused data from `/var/lib/docker/overlay2/`



-- This function goes through all existing folders, makes an inspection for all containers to check its use.



-- Relevant for virgin machines, on which containers are frequently updated and the volume of data grows to gigabytes, or even hundreds of gigabytes



<h1>RUN</h1>

```bash

node main.js

```

clear space /docker/overlay2
Is it safe to clean docker/overlay2
var/lib/docker/overlay2 cleanup
Some way to clean up / identify contents of /var/lib/docker
