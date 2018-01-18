#!/usr/bin/env bash

eval `docker-machine env manager1`

array=('./api-gateway'
  './fulltext-service'
  './metadata-extraction-service'
  './file-service'
  './user-service'
)

# we go to the root of the project
cd ..

for ((i = 0; i < ${#array[@]}; ++i)); do
  # we go to each folder
  cd ${array[$i]}

  # we get the name of our image
  SERVICE=$(echo ${array[$i]} | cut -d'/' -f 2)

  # we delete the image if it exists already
  docker rmi findit/$SERVICE

  # we create or recreate our image
  sh ./create-image.sh

  # we get the image id so we can tag it
  IMAGE_ID=$(docker images -q $SERVICE)

  # we tag our image so we can publish it to our docker hub account
  docker tag $IMAGE_ID crizstian/$SERVICE:latest

  # we publish our image to our docker hub account
  docker push findit/$SERVICE:latest

  # we delete our local image because we are not going to need it
  # and mentain clean our environment
  docker rmi $SERVICE

  # and we go back to the root again :D
  cd ..
done
