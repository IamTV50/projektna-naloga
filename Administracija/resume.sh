#!/bin/bash

backContainerName="backend-container"
frontContainerName="frontend-container"

# Resume the backend container
sudo docker start $backContainerName >/dev/null 2>&1 || true

# Resume the frontend container
sudo docker start $frontContainerName >/dev/null 2>&1 || true
