
# What is it?

Extremely lightwight swarm data sniffer that needed for a specific purpose. However, This does NOT collect container metrics like **cAdvisor**. This just collects the general info of a cluster via Docker API and dumps them into a Azure Blob storage.

# How to run?

```

docker run -d -e "STACC_NAME=<Name>" -e "STACC_KEY=<KEY>" -v /var/run/docker.sock:/var/run/docker.sock moimhossain/swarm-data-gen:latest

```


## Thanks!