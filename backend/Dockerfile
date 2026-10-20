# ---- Build stage ----
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy Maven wrapper and pom first so dependency resolution is cached
COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -q

# Copy sources and build the jar (tests skipped for image builds)
COPY src ./src
RUN ./mvnw package -DskipTests -q \
    && mv target/eduflow-backend-*.jar /app/app.jar

# ---- Runtime stage ----
FROM eclipse-temurin:17-jre-alpine

# Non-root user
RUN addgroup -S app && adduser -S app -G app

WORKDIR /app
COPY --from=build /app/app.jar app.jar

USER app
EXPOSE 8080

# ~384 MB heap on a 512 MB instance
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0 -XX:+UseSerialGC"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
