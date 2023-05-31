#!/bin/bash

networkName="paketnik_njt"
backImgName="backend-image"
frontImgName="frontend-image"
backContainerName="backend-container"
frontContainerName="frontend-container"

# Stop and delete existing containers if they exist
sudo docker stop $backContainerName $frontContainerName >/dev/null 2>&1 || true
sudo docker rm $backContainerName $frontContainerName >/dev/null 2>&1 || true

# Delete existing images if they exist
sudo docker rmi -f $backImgName $frontImgName >/dev/null 2>&1 || true

# Remove the network if it exists
sudo docker network rm $networkName >/dev/null 2>&1 || true
