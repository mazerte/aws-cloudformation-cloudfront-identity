var CfnLambda = require('cfn-lambda');
var AWS = require('aws-sdk');

var Identity = require('./lib/identity');

function CloudFrontIdentityHandler(event, context) {
  var CloudFrontIdentity = CfnLambda({
    Create: Identity.Create,
    Update: Identity.Update,
    Delete: Identity.Delete,
    SchemaPath: [__dirname, 'src', 'schema.json']
  });
  // Not sure if there's a better way to do this...
  AWS.config.region = currentRegion(context);

  return CloudFrontIdentity(event, context);
}

function currentRegion(context) {
  return context.invokedFunctionArn.match(/^arn:aws:lambda:(\w+-\w+-\d+):/)[1];
}

exports.handler = CloudFrontIdentityHandler;
