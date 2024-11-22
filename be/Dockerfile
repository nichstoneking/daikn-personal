from golang:1.23.1

WORKDIR /go/src/app

COPY . .

RUN go build -o main main.go

CMD ["./main"]
