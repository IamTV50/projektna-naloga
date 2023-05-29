#!/bin/bash

backContainerName="backend-container"
frontContainerName="frontend-container"

# Stop the backend container
sudo docker stop $backContainerName >/dev/null 2>&1 || true

# Stop the frontend container
sudo docker stop $frontContainerName >/dev/null 2>&1 || true
