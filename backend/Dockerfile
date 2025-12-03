FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY target/archipel-libre-backend-0.1.0-SNAPSHOT.jar app.jar

EXPOSE 8080

ENV JAVA_OPTS=""

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
