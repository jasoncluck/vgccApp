import { youtube } from "@googleapis/youtube";
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { v4 as uuidv4 } from "uuid";

import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { YT_API_KEY_SECRET_ARN } from "../../constant";

type YTApiKeySecretJson = { YTApiKey: string };
export const CHANNEL_IDS = {
  NEXTLANDER_ID: "UCO0gHyqLNeIrCAjwlO2BmiA",
  GIANT_BOMB_ID: "UCmeds0MLhjfkjD_5acPnFlQ",
} as const;

/**
 * This function will search YouTube for videos and place them in a DynamoDB table
 */
export const searchList = async () => {
  const tableName = process.env.TABLE_NAME;

  const secretsManagerClient = new SecretsManagerClient();
  const dynamodbClient = new DynamoDBClient();

  const { SecretString } = await secretsManagerClient.send(
    new GetSecretValueCommand({
      SecretId: YT_API_KEY_SECRET_ARN,
    })
  );

  if (!SecretString) {
    throw new Error("YouTube API key not found - stopping.");
  }

  const secretJson = JSON.parse(SecretString);

  if (!isYtApiKeySecret(secretJson)) {
    throw new Error("Youtube API key not valid - stopping.");
  }

  const youtubeClient = youtube({
    version: "v3",
    auth: secretJson.YTApiKey,
  });

  const { data } = await youtubeClient.search.list({
    part: ["snippet"],
    channelId: CHANNEL_IDS.NEXTLANDER_ID,
    order: "date",
  });

  const { nextPageToken, pageInfo, items } = data;

  console.log(pageInfo?.resultsPerPage);

  const { Attributes } = await dynamodbClient.send(
    new PutItemCommand({
      TableName: tableName,
      Item: {
        id: { S: uuidv4() },
        ...(nextPageToken && { paginationToken: { S: nextPageToken } }),
        ...(pageInfo?.totalResults && {
          totalResults: { N: pageInfo.totalResults.toString() },
        }),
      },
    })
  );

  console.log("JMC");
  console.log(Attributes);
};

function isYtApiKeySecret(k: any): k is YTApiKeySecretJson {
  return "YTApiKey" in k;
}
