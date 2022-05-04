import { cvToHex, hexToCV, stringAsciiCV } from "@stacks/transactions";
import { ClarityTypes } from "stacks/connect/types";
import { contractName, contractAddress } from "stacks/contract/calls";

const ResolveDomain = "get-domain-data";

export default async function handler(req, res) {

    try {

        const { domain } = req.query;

        const response = await fetch(`https://stacks-node-api.testnet.stacks.co/v2/contracts/call-read/${contractAddress}/${contractName}/${ResolveDomain}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sender: contractAddress, arguments: [cvToHex(stringAsciiCV(domain))] }),
        });

        const result = await response.json();

        const value = hexToCV(result.result);

        if (value.type == ClarityTypes.OptionalNone) {
            const error = new Error('The Domain is not Owned')
            error.status = 405
            throw error

        }

        else {

            const data = value.value.data.route;
            
            // if route not set
            if (data.type == ClarityTypes.OptionalNone)
            {
                res.status(200).send({ data: "none" })
            }

            // if route set
            else
            {
                if (data.value.type == ClarityTypes.StringASCII)
                {
                    res.status(200).send({ data: data.value.data })
                }
                else
                {
                    const error = new Error('The route is not a valid Clarity Value')
                    error.status = 405
                    throw error
                }
            }
        }
    }
    catch (err) {
        throw err;
    }
}