FROM golang:alpine AS builder
WORKDIR /app
COPY . .
RUN go mod download
WORKDIR /app/src/Command
RUN go build -o /app/Command

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/Command .
COPY --from=builder /app/config.yaml .
CMD ["./Command"]
