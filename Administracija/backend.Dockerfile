FROM ubuntu:20.04

# Install Node.js
RUN apt-get update \
    && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs

# Install Python 3.10
RUN apt-get install -y software-properties-common \
    && add-apt-repository -y ppa:deadsnakes/ppa \
    && apt-get update \
    && apt-get install -y python3.10 python3-distutils

# Install pip for Python 3.10
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py \
    && python3.10 get-pip.py

# Install OpenCV and TensorFlow
RUN python3.10 -m pip install opencv-contrib-python tensorflow

# Install other dependencies
RUN apt-get install -y build-essential python3.10-dev

WORKDIR /app/backend

COPY ../RAZI/backend .

RUN npm install 

CMD npm start