
FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Copy over the working HEAD we downloaded from S3
COPY . .

# Run the init script to get our working directory set up if it needs to be
RUN chmod +x ./.remy/scripts/init.sh
RUN ./.remy/scripts/init.sh https://projects.koji-cdn.com/c6b91ce4-fbd6-43e8-9609-1c3dc447485b.git

# Run install commands if we have them
RUN npm install --prefix .remy
RUN npm install --prefix frontend
RUN npm install --prefix backend

# Start remy
CMD npm start --prefix ./.remy
