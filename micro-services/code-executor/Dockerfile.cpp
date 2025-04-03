FROM gcc:latest
WORKDIR /app
CMD ["sh", "-c", "g++ script.cpp -o script && ./script"]