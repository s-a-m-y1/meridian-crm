#!/bin/bash
# Wait for LocalStack to be ready
until awslocal s3 ls 2>/dev/null; do
  sleep 1
done

# Create the bucket
awslocal s3 mb s3://crm-files 2>/dev/null || true

# Set bucket to public (for development)
awslocal s3api put-bucket-acl --bucket crm-files --acl public-read 2>/dev/null || true

echo "S3 bucket 'crm-files' initialized"
