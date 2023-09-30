# salesforce-pub-sub
Dreamforce 2023 Salesforce Pub/Sub API Implemenation demo of Salesforce Orders and AWS DynamoDB Table

Note : This repo is a fork of Salesforce Pub/Sub immplementation from https://github.com/pozil/pub-sub-api-node-client , This repo contains custom channel implementation enhancement (channelschema.js) which is not supported in origial repo source as of now. Also this is solution of Salesforce -AWS DynamoDB integration using Pub/Sub API.

## Integration Pattern

df2023-diagram-sfdc-dynamodb-pubsub.jpg![image](https://github.com/ramanathansj/salesforce-pub-sub/assets/881993/ebcf4674-d2e3-40a4-8c5d-fc94ae18f2e2)


## To run project do the following,

1. Enter Salesforce, AWS credentials in .env file in src folder
2. Run node db.js file in src folder to create dynamodb table
3. Run node pubsubconnect.js file in src folder to receive Salesforce Pub/Sub events

## Screenshots:

## Start Pub/Sub connector from terminal

<img width="1041" alt="Screen Shot 2023-09-29 at 6 58 22 PM" src="https://github.com/ramanathansj/salesforce-pub-sub/assets/881993/c27d6d91-b0e0-41a7-a15d-196640aa928a">


## Edit an Order record in Salesforce


<img width="835" alt="Screen Shot 2023-09-29 at 7 05 44 PM" src="https://github.com/ramanathansj/salesforce-pub-sub/assets/881993/b697de9b-59a5-409b-aeb8-c220897ff4c8">

Note : Install Async package from https://github.com/ramanathansj/salesforce-async-request-reply-queues/tree/main and also follow Pub/Sub Instructions
## Binary event data received


<img width="1282" alt="Screen Shot 2023-09-29 at 7 08 07 PM" src="https://github.com/ramanathansj/salesforce-pub-sub/assets/881993/258d1d50-f9c1-4720-ac75-afdf806f15b6">


## Deserialized event data


<img width="1468" alt="Screen Shot 2023-09-29 at 7 10 55 PM" src="https://github.com/ramanathansj/salesforce-pub-sub/assets/881993/3246a3b8-678f-4bde-99c5-690212ae10b5">


