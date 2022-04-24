import { networkType, myStxAddress, isConnected } from "../connect/auth";

import {
    callReadOnlyFunction,
    cvToJSON,
    standardPrincipalCV,
    stringAsciiCV,
    bufferCV,
    responseErrorCV,
    responseOkCV,
    trueCV,
    falseCV,
    uintCV,
    intCV,
    FungibleConditionCode,
    makeStandardSTXPostCondition,
    NonFungibleConditionCode,
    makeStandardNonFungiblePostCondition,
    createAssetInfo,
    bufferCVFromString,
} from "@stacks/transactions";

import { openContractCall } from "@stacks/connect";

const contractAddress = "STYMF4ARBZEVT61CKV8RBQHC6NCGCAF7AQWH979K";
const contractName = "custom-domain";

async function appCallReadOnlyFunction(optionsProps) {
    if (!optionsProps)
        return new Promise((resolve, reject) => reject("no arguments provided"));

    const options = {
        ...optionsProps,
        network: networkType(),
        senderAddress: myStxAddress(),
    };

    return callReadOnlyFunction(options)
        .then((response) => {
            const responseJson = cvToJSON(response);

            return new Promise((resolve, reject) => resolve(responseJson));
        })
        .catch((e) => {
            return new Promise((resolve, reject) => reject(e));
        });
}

async function appCallPublicFunction(optionsProps) {

    if (!optionsProps)
        return new Promise((resolve, reject) => reject("no arguments provided"));

    const options = {
        ...optionsProps,
        network: networkType(),
        appDetails: {
            name: "Amortize",
            icon: window.location.origin + "/img/Logo.svg",
        },
        senderAddress: myStxAddress(),
    };


    openContractCall(options);

};

export async function checkAvailability(domainName) {
    if (isConnected()) {
        const options = {
            contractAddress: contractAddress,
            contractName: contractName,
            functionName: "is-available",
            functionArgs: [stringAsciiCV(domainName)],
        }

        const result = await appCallReadOnlyFunction(options);

        if (result) {
            return result.value;
        }
    }
    else {
        alert("Please Connect your Wallet")
    }
}

export async function registerDomain(domainName) {

    if (isConnected()) {

        const date = new Date();

        const domainData = {
            PurchaseTime: date,
            ExpiryYear: date.getFullYear() + 5
        }

        const postConditionAddress = myStxAddress();
        const postConditionCode = NonFungibleConditionCode.Owns;
        const nonFungibleAssetInfo = createAssetInfo(contractAddress, contractName, "AMORTIZE-DOMAIN");
        const tokenAssetName = stringAsciiCV(domainName);
        const postConditions = [
            makeStandardNonFungiblePostCondition(postConditionAddress, postConditionCode, nonFungibleAssetInfo, tokenAssetName)
        ];

        const options = {
            contractAddress: contractAddress,
            contractName: contractName,
            functionName: "mint",
            postConditions,
            functionArgs: [
                // enter all your function arguments here but cast them to CV first
                standardPrincipalCV(myStxAddress()),
                stringAsciiCV(domainName),
                bufferCV(Buffer.from(JSON.stringify(domainData)))
            ],
        }

        let response = await appCallPublicFunction(options);
    }
    else {
        alert("Please Connect your Wallet")
    }
}

export async function fetchDomains() {
        let response = await fetch(`https://stacks-node-api.testnet.stacks.co/extended/v1/tokens/nft/holdings?principal=${myStxAddress()}&asset_identifiers=STYMF4ARBZEVT61CKV8RBQHC6NCGCAF7AQWH979K.custom-domain::AMORTIZE-DOMAIN`)

        let data = await response.json();

        return data.results;
    }