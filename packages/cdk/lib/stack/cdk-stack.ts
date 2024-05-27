import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import path = require("path");
import { YT_API_KEY_SECRET_ARN } from "../constant";

export class VgcStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "vgcBucket");

    const table = new dynamodb.Table(this, "vgcTable", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },

      importSource: {
        compressionType: dynamodb.InputCompressionType.GZIP,
        inputFormat: dynamodb.InputFormat.csv({
          delimiter: ",",
          headerList: ["id", "name"],
        }),
        bucket,
        keyPrefix: "prefix",
      },
    });

    const searchListLambda = new nodejs.NodejsFunction(
      this,
      "vgcYTSearchHandler",
      {
        description: "Populates a table with search results from YouTube",
        entry: path.join(__dirname, "../construct/lambda/yt-search.ts"),
        handler: "searchList",
        runtime: lambda.Runtime.NODEJS_20_X,
        environment: {
          TABLE_NAME: table.tableName,
        },
        bundling: {},
      }
    );

    searchListLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["secretsmanager:GetSecretValue"],
        resources: [YT_API_KEY_SECRET_ARN],
      })
    );
    table.grantWriteData(searchListLambda);
  }
}
