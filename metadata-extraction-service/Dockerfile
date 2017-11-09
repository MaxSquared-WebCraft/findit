FROM openjdk:8-jre-alpine

COPY ./target/metadata-extraction-service-0.0.1-SNAPSHOT.jar /usr/src/app/
WORKDIR /usr/src/app
EXPOSE 8080
CMD ["java", "-jar", "metadata-extraction-service-0.0.1-SNAPSHOT.jar"]