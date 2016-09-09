var AWS = require('aws-sdk');
var uuid = require('uuid');
var CfnLambda = require('cfn-lambda');

var cloudfront = new AWS.CloudFront({apiVersion: '2016-08-20'});

var Create = function(params, reply) {
  params.CallerReference = uuid.v4();
  var p = {
    CloudFrontOriginAccessIdentityConfig: params
  };
  cloudfront.createCloudFrontOriginAccessIdentity(p, function(err, data) {
    if (err) {
      reply(err);
    } else  {
      reply(null, data.CloudFrontOriginAccessIdentity.Id, { S3CanonicalUserId: data.CloudFrontOriginAccessIdentity.S3CanonicalUserId });
    }
  });
};

var Update = function(physicalId, params, oldParams, reply) {
  cloudfront.getCloudFrontOriginAccessIdentity({ Id: physicalId }, function(err, data) {
    if (err) {
      console.error(err);
      return reply(err);
    }
    params.CallerReference = uuid.v4();
    var p = {
      Id: physicalId,
      CloudFrontOriginAccessIdentityConfig: params,
      IfMatch: data.ETag
    }
    cloudfront.updateCloudFrontOriginAccessIdentity(p, function(err, data) {
      if (err) {
        console.error(err);
        reply(err);
      } else {
        reply(null, data.CloudFrontOriginAccessIdentity.Id, { S3CanonicalUserId: data.CloudFrontOriginAccessIdentity.S3CanonicalUserId });
      }
    });
  });
};

var Delete = function(physicalId, params, reply) {
  cloudfront.getCloudFrontOriginAccessIdentity({ Id: physicalId }, function(err, data) {
    if (err) {
      console.error(err);
      return reply(err);
    }
    var p = {
      Id: physicalId,
      IfMatch: data.ETag
    };
    cloudfront.deleteCloudFrontOriginAccessIdentity(p, function(err, data) {
      if (err) console.error(err)
      reply(err, physicalId);
    });
  });
};

exports.Create = Create;
exports.Update = Update;
exports.Delete = Delete;
