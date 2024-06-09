FROM gcc:latest
WORKDIR /usr/src/app
COPY . .
RUN g++ -o code code.cpp
CMD ["./code"]
