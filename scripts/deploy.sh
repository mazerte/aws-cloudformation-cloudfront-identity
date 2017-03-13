#!/bin/bash
# deploy.sh

# Configuration
AWS_PROFILE="delichty"
BUCKET="ourpts-common-ohio-454844014023"
S3PATH="lambda"
PACKAGE="aws-cloudformation-cloudfront-identity.zip"

echo "Biulding the package"
#node_modules/.bin/cfn-lambda zip --output deploy/archive.zip

echo "Deploy version to S3"
aws --profile ${AWS_PROFILE} s3 cp deploy/archive.zip s3://${BUCKET}/${S3PATH}/${PACKAGE}
