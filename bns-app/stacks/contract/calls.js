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
    noneCV,
    someCV,
} from "@stacks/transactions";

import { openContractCall } from "@stacks/connect";

const contractAddress = "STYMF4ARBZEVT61CKV8RBQHC6NCGCAF7AQWH979K";
const contractName = "custom-domain-V2";

async function appCallReadOnlyFunction(optionsProps) {
    if (!optionsProps)
        return new Promise((resolve, reject) => reject("no arguments provided"));

    const options = {
        ...optionsProps,
        network: networkType(),
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

    const options = {
        contractAddress: contractAddress,
        contractName: contractName,
        functionName: "is-available",
        functionArgs: [stringAsciiCV(domainName)],
        senderAddress: contractAddress
    }

    const result = await appCallReadOnlyFunction(options);

    if (result) {
        return result.value;
    }
}

export async function registerDomain(domainName) {

    if (isConnected()) {

        const postConditionAddress = myStxAddress();
        const postConditionCode = NonFungibleConditionCode.Owns;
        const nonFungibleAssetInfo = createAssetInfo(contractAddress, contractName, "AMORTIZE-DOMAIN");
        const tokenAssetName = stringAsciiCV(domainName);
        const postConditions = [
            makeStandardNonFungiblePostCondition(postConditionAddress, postConditionCode, nonFungibleAssetInfo, tokenAssetName)
        ];

        let date = new Date();

        const purchased = Math.floor(date/1000);

        date.setFullYear(date.getFullYear() + 5);

        const expiry = Math.floor(date/1000);

        const options = {
            contractAddress: contractAddress,
            contractName: contractName,
            functionName: "mint-domain",
            postConditions,
            functionArgs: [
                // enter all your function arguments here but cast them to CV first
                standardPrincipalCV(myStxAddress()),
                stringAsciiCV(domainName),
                uintCV(purchased),
                uintCV(expiry),
                noneCV(),
            ],
            validateWithAbi: true,
        }

        appCallPublicFunction(options);
    }
    else {
        alert("Please Connect your Wallet")
    }
}

export async function burnDomain(domainName) {

    if (isConnected()) {

        const postConditionAddress = myStxAddress();
        const postConditionCode = NonFungibleConditionCode.DoesNotOwn;
        const nonFungibleAssetInfo = createAssetInfo(contractAddress, contractName, "AMORTIZE-DOMAIN");
        const tokenAssetName = stringAsciiCV(domainName);
        const postConditions = [
            makeStandardNonFungiblePostCondition(postConditionAddress, postConditionCode, nonFungibleAssetInfo, tokenAssetName)
        ];

        const options = {
            contractAddress: contractAddress,
            contractName: contractName,
            functionName: "burn",
            postConditions,
            functionArgs: [
                // enter all your function arguments here but cast them to CV first
                stringAsciiCV(domainName),
            ],
            validateWithAbi: true,
        }

        appCallPublicFunction(options);
    }
    else {
        alert("Please Connect your Wallet")
    }
}

export async function transferDomain(domainName, newOwner) {

    if (isConnected()) {

        const postConditionSellerAddress = myStxAddress();
        const postConditionSellerCode = NonFungibleConditionCode.DoesNotOwn;

        const postConditionBuyerAddress = newOwner;
        const postConditionBuyerCode = NonFungibleConditionCode.Owns;


        const nonFungibleAssetInfo = createAssetInfo(contractAddress, contractName, "AMORTIZE-DOMAIN");
        const tokenAssetName = stringAsciiCV(domainName);

        const postConditions = [
            makeStandardNonFungiblePostCondition(postConditionSellerAddress, postConditionSellerCode, nonFungibleAssetInfo, tokenAssetName),
            makeStandardNonFungiblePostCondition(postConditionBuyerAddress, postConditionBuyerCode, nonFungibleAssetInfo, tokenAssetName)
        ];

        const options = {
            contractAddress: contractAddress,
            contractName: contractName,
            functionName: "transfer-ownership",
            postConditions,
            functionArgs: [
                // enter all your function arguments here but cast them to CV first
                standardPrincipalCV(newOwner),
                stringAsciiCV(domainName),
            ],
        }

        appCallPublicFunction(options);
    }
    else {
        alert("Please Connect your Wallet")
    }
}

export async function setRedirectRoute(domainName, route) {

    if (isConnected()) {

        const options = {
            contractAddress: contractAddress,
            contractName: contractName,
            functionName: "set-route",
            functionArgs: [
                // enter all your function arguments here but cast them to CV first
                stringAsciiCV(domainName),
                someCV(stringAsciiCV(route))
            ],
            validateWithAbi: true,
        }

        appCallPublicFunction(options);
    }
    else {
        alert("Please Connect your Wallet")
    }
}

export async function disableRedirectRoute(domainName, route) {

    if (isConnected()) {

        const options = {
            contractAddress: contractAddress,
            contractName: contractName,
            functionName: "disable-route",
            functionArgs: [
                // enter all your function arguments here but cast them to CV first
                stringAsciiCV(domainName),
            ],
            validateWithAbi: true,
        }

        appCallPublicFunction(options);
    }
    else {
        alert("Please Connect your Wallet")
    }
}
