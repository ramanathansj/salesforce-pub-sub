/**
 * @description       : class to update dynamodb records with events message from salesforce
 * @author            : Ramanathan
 * @group             :
 * @last modified on  : 09-19-2023
 * @last modified by  : Ramanathan
 **/

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();
//const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({region: 'us-east-1', profile: 'sfdcuser'}));
const docClient = DynamoDBDocumentClient.from(
    new DynamoDBClient({
        region: process.env.AWS_REGION,
        profile: process.env.AWS_USER_PROFILE
    })
);

export default class ERPOrderService {
    async upsertOrders(items) {
        let ordbody = JSON.parse(items.payload.Payload__c.string);
        let itemdata = {
            externalId: ordbody.Id,
            name: ordbody.Name,
            status: 'Completed',
            id: uuidv4(),
            orderdata: ordbody,
            requestId: items.requestId,
            replayId: items.replayId
        };
        //console.log('itemdata = ' + JSON.stringify(itemdata));
        let dbresult = await this.executeDbCommand(itemdata, 'ordersv1');
        let reqrps = { request: itemdata, response: dbresult };
        return reqrps;
    }

    //https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-dynamodb-utilities.html
    async executeDbCommand(items, tblname) {
        console.log('items == ' + JSON.stringify(items));
        let tblcmd = new PutCommand({
            TableName: tblname,
            Item: items
        });
        let response = {};
        try {
            // console.log('type of == ' + typeof docClient.send);
            // console.log('tblcmd == ' + JSON.stringify(tblcmd));
            docClient.send(tblcmd).then(
                (data) => {
                    console.log(`db result == ${JSON.stringify(data)}`);
                    return data;
                },
                (error) => {
                    console.error('error == ' + JSON.stringify(error));
                }
            );
        } catch (ex) {
            console.error('error == ' + JSON.stringify(ex));
        }
        return response;
    }
}

// let item = {"replayId":1027754,"payload":{"CreatedDate":1691714823404,"CreatedById":"005B0000005GMN7IAO","Payload__c":{"string":"{\"attributes\":{\"type\":\"Order__c\",\"url\":\"/services/data/v59.0/sobjects/Order__c/a01B000000FLrHDIA1\"},\"LastModifiedDate\":\"2023-08-11T00:47:03.000+0000\",\"IsDeleted\":false,\"OrderType__c\":\"Work Order\",\"BuyerContact__c\":\"003B000000HUIwFIAX\",\"OrderTotalAmount__c\":0.00,\"CurrencyIsoCode\":\"USD\",\"Name\":\"O-080623-0000016\",\"PaymentTerms__c\":\"75\",\"SystemModstamp\":\"2023-08-11T00:47:03.000+0000\",\"OwnerId\":\"005B0000005GMN7IAO\",\"CreatedById\":\"005B0000005GMN7IAO\",\"OrderRecordType__c\":\"Sales Order\",\"OrderTotalQuantity__c\":0.0000,\"PaymentType__c\":\"Credit Card\",\"RecordTypeId\":\"012B0000000RLwHIAW\",\"CreatedDate\":\"2023-08-06T01:17:46.000+0000\",\"Account__c\":\"001B000001SLk1GIAT\",\"Id\":\"a01B000000FLrHDIA1\",\"LastModifiedById\":\"005B0000005GMN7IAO\"}"},"EventId__c":{"string":"a01B000000FLrHDIA1"},"MetadataType__c":{"string":"Order__c"}}}
// let dbserv = new ERPOrderService();
// dbserv.upsertOrders(item);
