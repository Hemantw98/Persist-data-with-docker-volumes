## Persist data with docker compose 

### Persist data of a MongoDB container by attaching a Docker volume to it.

### Technologies used:
Docker, Node.js, MongoDB


### Below are the steps for persisting data of a MongoDB container by attaching a Docker volume to it in a Docker Compose YAML file:

Step 1: Create a new file named docker-compose.yaml in a directory where you want to store the MongoDB data.

Step 2: Add the following content to the docker-compose.yaml file:

        version: '3'
    services:
      # my-app:
        # image: ${docker-registry}/my-app:1.0
        # ports:
         # - 3000:3000
      mongodb:
        image: mongo
        ports:
         - 27017:27017
        environment:
         - MONGO_INITDB_ROOT_USERNAME=admin
         - MONGO_INITDB_ROOT_PASSWORD=password
        volumes:
         - mongo-data:/data/db
      mongo-express:
        image: mongo-express
        restart: always
        ports:
         - 8080:8081
        environment:
         - ME_CONFIG_MONGODB_ADMINUSERNAME=admin
         - ME_CONFIG_MONGODB_ADMINPASSWORD=password
         - ME_CONFIG_MONGODB_SERVER=mongodb
        depends_on:
         - "mongodb"
    volumes:
      mongo-data:
        driver: local
        
Note: This YAML file defines a Docker Compose service named mongodb, which uses the official mongo image from Docker Hub. The volumes section attaches a volume named my_mongo_data to the container at the path /data/db. The ports section maps the container port 27017 to the host port 27017.
             
Step 3: Save the docker-compose.yaml file.

Step 4: Start the MongoDB container using the following command:

    docker compose -f docker-compose.yaml
    
Note: This command starts the MongoDB container in the background and attaches the volume my_mongo_data to it.
    
Step 5: Verify that the container is running by running the following command:

    docker ps
    
Step 6: Connect to the MongoDB container using a MongoDB client tool such as Robo 3T or Mongo Shell to create databases and collections.

Step 7: Stop the container using the following command:

    docker compose -f docker-compose.yaml
    
Step 8: This command stops and removes the container, but the volume attached to it remains intact.

By using a Docker Compose YAML file to start the MongoDB container, you can easily manage the container and its dependencies. The volume definition in the YAML file allows you to persist the data stored in the container even if the container is stopped or deleted.
   
