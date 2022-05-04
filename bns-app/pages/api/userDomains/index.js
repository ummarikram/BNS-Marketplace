import { cvToHex, hexToCV, stringAsciiCV } from "@stacks/transactions";
import { ClarityTypes } from "stacks/connect/types";
import { contractName, contractAddress, assetName } from "stacks/contract/calls";

const ResolveDomain = "get-route";

export default async function handler(req, res) {

    const { principal } = req.query;

    try {

        const response = await fetch(`https://stacks-node-api.testnet.stacks.co/extended/v1/tokens/nft/holdings?principal=${principal}&asset_identifiers=${contractAddress}.${contractName}::${assetName}`)

        const result = await response.json();

        let results = [];

        const grabRoutes = async () => {

            for (let i = 0; i < result.results.length; i++) {

                let domainName = result.results[i].value.repr;

                domainName = domainName.substring(1, domainName.length - 1);

                console.log(domainName);

                try {
                    const routeResponse = await fetch(`https://stacks-node-api.testnet.stacks.co/v2/contracts/call-read/${contractAddress}/${contractName}/${ResolveDomain}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ sender: principal, arguments: [cvToHex(stringAsciiCV(domainName))] }),
                    });


                    const routeResult = await routeResponse.json();

                    const value = hexToCV(routeResult.result);

                    if (value.type == ClarityTypes.OptionalSome) {

                        results.push({ domain: domainName, route: value.value.data })
                    }
                    else {
                        results.push({ domain: domainName, route: null })
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
        }

        await grabRoutes();

        res.status(200).send({ data: results })

    }

    catch (err) {
        res.status(405).send({ error: err })
    }
}