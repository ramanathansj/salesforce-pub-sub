/**
 * @description       : pubsub connector which listens for salesforce events
 * @author            : Ramanathan
 * @group             :
 * @last modified on  : 09-19-2023
 * @last modified by  : Ramanathan
 **/

import PubSubApiClient from './client.js';
import ChannelSchema from './channelshcema.js';
import ERPOrderService from './erporder.js';
import dotenv from 'dotenv';
dotenv.config();
const client = new PubSubApiClient();

async function subscribe(channel, evtcount) {
    let evtdata = {};
    try {
        //set channel metadata
        let chnmeta = await getEventMetadata();
        console.log('channel schema = ' + JSON.stringify(chnmeta));
        client.setChannelMeta(chnmeta);
        await client.connect();
        // Subscribe to a single incoming account change events
        const eventEmitter = await client.subscribe(channel, evtcount);
        // Handle incoming events
        await eventEmitter.on('data', async (event) => {
            //console.log(`Handling change event ${event.replayId}`);
            evtdata = event;
            console.log('evtddata = ' + JSON.stringify(evtdata));
            if (
                evtdata.payload.MetadataType__c &&
                evtdata.payload.MetadataType__c.string == 'Order__c'
            ) {
                upsertOrders(evtdata).then(async (ordrsp) => {
                    // let sfrsp = await publish(ordrsp);
                    console.log('sfdc event == %j' + ordrsp);
                });
            } else {
                console.log('no match found');
            }
        });
    } catch (error) {
        console.error(error);
    }
    return evtdata;
}

/*
async function publish(ordrsp) {
    console.log('Order Rsp === ' + JSON.stringify(ordrsp));
    const payload = {
        Payload__c: { string: JSON.stringify(ordrsp) },
        CreatedDate: Date.now(),
        CreatedById: '005B0000005GMN7IAO'
    };
    try {
        let chnmeta = await getEventMetadata();
        console.log('channel schema = ' + JSON.stringify(chnmeta));
        client.setChannelMeta(chnmeta);
        await client.connect();
        const publishResult = await client.publish(
            '/event/ERP_Inbound_Event__e',
            payload
        );
        console.log('Published event: ', JSON.stringify(publishResult));
    } catch (ex) {
        console.error(`error occurred == ${JSON.stringify(ex)}`);
    }
}*/

async function getEventMetadata() {
    let cutil = new ChannelSchema();
    let metacache = await cutil.describeSchema({
        members: ['OrderEvent__e', 'OrderInboundEvent__e']
    });
    return metacache;
}

async function upsertOrders(evtdata) {
    let ordMgr = new ERPOrderService();
    return await ordMgr.upsertOrders(evtdata);
}

subscribe(process.env.PUB_SUB_CHANNEL, process.env.PUB_SUB_EVT_COUNT);

//publish({"request":{"externalId":"a01B000000FLrxlIAD","name":"O-081123-0000017","status":"pending","id":"345e72ef-7dda-4516-a0a2-d65e5c52ebff","orderdata":{"attributes":{"type":"Order__c","url":"/services/data/v59.0/sobjects/Order__c/a01B000000FLrxlIAD"},"LastModifiedDate":"2023-08-14T02:09:21.000+0000","IsDeleted":false,"OrderType__c":"Work Order","BuyerContact__c":"003B000000HUIwFIAX","OrderTotalAmount__c":0,"CurrencyIsoCode":"USD","Name":"O-081123-0000017","PaymentTerms__c":"20","SystemModstamp":"2023-08-14T02:09:21.000+0000","OwnerId":"005B0000005GMN7IAO","CreatedById":"005B0000005GMN7IAO","OrderRecordType__c":"Sales Order","OrderTotalQuantity__c":0,"PaymentType__c":"Credit Card","RecordTypeId":"012B0000000RLwHIAW","CreatedDate":"2023-08-11T03:41:54.000+0000","Account__c":"001B000001SLk1GIAT","Id":"a01B000000FLrxlIAD","LastModifiedById":"005B0000005GMN7IAO"}},"response":{}})
