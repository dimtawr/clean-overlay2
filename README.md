 -- There is an issue with `docker prune` not clearing unused data from `/var/lib/docker/overlay2/`

 -- This function goes through all existing folders, makes an inspection for all containers to check its use.

 -- Relevant for virgin machines, on which containers are frequently updated and the volume of data grows to gigabytes, or even hundreds of gigabytes