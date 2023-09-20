# salesforce-pub-sub
Dreamforce 2023 Pub/Sub API Implemenation demo of Salesforce Orders and AWS DynamoDB Table

Note : This repo is a fork of Salesforce Pub/Sub immplementation from https://github.com/pozil/pub-sub-api-node-client , This repo contains custom channel implementation enhancement (channelschema.js) which is not supported in origial repo source as of now.

Integration Pattern

df2023-diagram-sfdc-dynamodb-pubsub.jpg![image](https://github.com/ramanathansj/salesforce-pub-sub/assets/881993/ebcf4674-d2e3-40a4-8c5d-fc94ae18f2e2)


To run project do the following,

1. Enter Salesforce, AWS credentials in .env file in src folder
2. Run node db.js file in src folder to create dynamodb table
3. Run node pubsubconnect.js file in src folder to receive Salesforce Pub/Sub events
