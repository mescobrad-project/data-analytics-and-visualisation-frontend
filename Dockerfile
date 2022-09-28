FROM node:14-alpine

# set working directory
WORKDIR /data-analytics-and-visualisation-frontend

# add `/data-analytics-and-visualisation-frontend/node_modules/.bin` to $PATH
ENV PATH /data-analytics-and-visualisation-frontend/node_modules/.bin:$PATH

# install Project requirements
COPY package.json .
RUN npm install

# Copy app files
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
