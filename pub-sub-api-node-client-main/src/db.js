/**
 * @description       : execute this file once to setup dynamodb table
 * @author            : Ramanathan
 * @group             : 
 * @last modified on  : 09-19-2023
 * @last modified by  : Ramanathan
**/

import { CreateTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import dotenv from "dotenv"
dotenv.config();
//const client = new DynamoDBClient({ region: 'us-east-1', profile: 'sfdcuser' });
const client = new DynamoDBClient({ region: process.env.AWS_REGION, profile: process.env.AWS_USER_PROFILE });
class DynamoDbMgr {
    async createTable(params) {
        let creatTblCmd = new CreateTableCommand({
            TableName: params.tablename,
            AttributeDefinitions: params.attrributeDef,
            KeySchema: params.keyDef,
            ProvisionedThroughput: params.provisionDef
        });
        const response = await client.send(creatTblCmd);
        return response;
    }

    async createOrdersTbl() {
        let params = {
            tablename: 'ordersv1',
            attrributeDef: [
                {
                    AttributeName: 'externalId',
                    AttributeType: 'S'
                },
                {
                    AttributeName: 'name',
                    AttributeType: 'S'
                }
            ],
            keyDef: [
                {
                    AttributeName: 'externalId',
                    KeyType: 'HASH'
                },
                {
                    AttributeName: 'name',
                    KeyType: 'RANGE'
                }
            ],
            provisionDef: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            }
        };

        let tblRsp = await this.createTable(params);
        console.log(tblRsp);
        return tblRsp;
    }

    async createUpdateTables() {
        await this.createOrdersTbl();
    }
}

let mgr = new DynamoDbMgr();
mgr.createUpdateTables();
