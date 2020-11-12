FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Change timezone
RUN ln -sf /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime

# Install AWS CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" 
RUN unzip awscliv2.zip 
RUN ./aws/install


RUN npm install
RUN npm install -g nodemon
RUN npm install -g npm-check-updates
RUN npm install aws-sdk
RUN npm install uuid

RUN export PORT=8080

EXPOSE 8080
#CMD [ "nodemon", "server.js" ]
CMD tail -f /dev/null