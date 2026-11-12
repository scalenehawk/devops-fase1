#!/usr/bin/env bash
set -euo pipefail

stack_name="${1:?Informe o nome da stack}"
bucket_name="${2:?Informe um nome de bucket globalmente único}"

aws cloudformation deploy \
  --stack-name "$stack_name" \
  --template-file infra/stack.yaml \
  --parameter-overrides "BucketName=$bucket_name" \
  --no-fail-on-empty-changeset

npm run build
aws s3 sync dist/ "s3://$bucket_name/" --delete
aws cloudformation describe-stacks \
  --stack-name "$stack_name" \
  --query "Stacks[0].Outputs[?OutputKey=='SiteUrl'].OutputValue" \
  --output text
