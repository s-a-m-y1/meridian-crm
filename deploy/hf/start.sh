#!/bin/sh
# Start embedded Redis (queue broker) then the NestJS backend.
# Redis is ephemeral by design: BullMQ jobs are transient, persistence off.
set -e

redis-server --bind 127.0.0.1 --port 6379 --dir /data/redis \
  --save '' --appendonly no --logfile /data/redis/redis.log --daemonize yes
echo "Embedded Redis listening on 127.0.0.1:6379"

exec node dist/src/main.js
