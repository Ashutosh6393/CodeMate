FROM openjdk:17-slim
WORKDIR /usr/src/app
COPY . .
RUN javac code.java
CMD ["java", "code"]
