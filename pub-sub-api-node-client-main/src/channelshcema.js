/**
 * @description       : Class for describing salesforce custom channel
 * @author            : Ramanathan
 * @group             :
 * @last modified on  : 09-19-2023
 * @last modified by  : Ramanathan
 **/

import jsforce from 'jsforce';
import avro from 'avro-js';
import dotenv from 'dotenv';
dotenv.config();

class ChannelSchema {
    async describeSchema(channel) {
        //console.log("await SalesforceAuth.authenticate() == "+ SalesforceAuth);
        let authinfo;
        try {
            authinfo = await this.authWithUsernamePassword();
            console.log(`Connected to Salesforce org ${authinfo.instanceUrl}`);
        } catch (error) {
            console.error(error);
        }
        //console.log("auth == "+JSON.stringify(authinfo));
        let metacache = {};
        if (authinfo) {
            for await (const member of channel.members) {
                let schema = await this.fetchMetadata(authinfo, member);
                let avroSchm = {
                    id: schema.uuid,
                    type: avro.parse(schema)
                };
                metacache[schema.uuid] = avroSchm;
                //console.log("schema schema== "+JSON.stringify(schema));
                console.log('avro parse schema== ' + JSON.stringify(avroSchm));
            }
        }
        return metacache;
    }

    async fetchMetadata(auth, eventname) {
        let sfcon = this.getsfconnection(auth);
        let schemareq = {
            url: `/services/data/v58.0/sobjects/${eventname}/eventSchema?payloadFormat=compact`,
            method: 'get',
            body: '',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let schemarsp = await sfcon.request(schemareq, (err, rsp) => rsp);
        //console.log("schema == "+ JSON.stringify(schemarsp));
        return schemarsp;
    }

    async authWithUsernamePassword() {
        const sfConnection = new jsforce.Connection({
            loginUrl: process.env.SALESFORCE_LOGIN_URL
        });
        await sfConnection.login(
            process.env.SALESFORCE_USERNAME,
            process.env.SALESFORCE_PASSWORD + '' + process.env.SALESFORCE_TOKEN
        );
        return {
            accessToken: sfConnection.accessToken,
            instanceUrl: sfConnection.instanceUrl,
            organizationId: sfConnection.userInfo.organizationId
        };
    }

    getsfconnection(auth) {
        let sfcon = new jsforce.Connection({
            instanceUrl: auth.instanceUrl,
            accessToken: auth.accessToken
        });
        return sfcon;
    }
}

export default ChannelSchema;

/*
let cutil = new ChannelSchema();
cutil.describeSchema({
    members: ["OrderEvent__e", "BlockEvent__e"]
});*/
