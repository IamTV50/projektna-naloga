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

# Create a network if it doesn't exist
sudo docker network create $networkName 2>/dev/null || true

# Build backend image
sudo docker build -t $backImgName -f backend.Dockerfile .

# Build frontend image
sudo docker build -t $frontImgName -f frontend.Dockerfile .

# Run backend container
#sudo docker run -d --name $backContainerName -p 3001:3001 --network $networkName -v $(pwd)/backend:/app/backend $backImgName
sudo docker run -d --name $backContainerName -p 3001:3001 --network $networkName $backImgName

# Run frontend container
#sudo docker run -d --name $frontContainerName -p 3000:3000 --network $networkName -v $(pwd)/frontend:/app/frontend $frontImgName
sudo docker run -d --name $frontContainerName -p 3000:3000 --network $networkName $frontImgName
