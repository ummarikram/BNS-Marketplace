import { cvToHex, hexToCV, stringAsciiCV } from "@stacks/transactions";

const ContractName = "custom-domain-V2";
const ContractAddress = "STYMF4ARBZEVT61CKV8RBQHC6NCGCAF7AQWH979K";
const ResolveDomain = "get-domain-data";

class ClarityType {
    // Create new instances of the same class as static attributes
    static OptionalNone = 9
    static OptionalSome = 10
    static StringASCII = 13
}


export default async function handler(req, res) {

    try {

        const { domain } = req.query;

        const response = await fetch(`https://stacks-node-api.testnet.stacks.co/v2/contracts/call-read/${ContractAddress}/${ContractName}/${ResolveDomain}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sender: ContractAddress, arguments: [cvToHex(stringAsciiCV(domain))] }),
        });

        const result = await response.json();

        const value = hexToCV(result.result);

        if (value.type == ClarityType.OptionalNone) {
            const error = new Error('The Domain is not Owned')
            error.status = 405
            throw error

        }

        else {

            const data = value.value.data.route;
            
            // if route not set
            if (data.type == ClarityType.OptionalNone)
            {
                res.status(200).send({ data: "none" })
            }

            // if route set
            else
            {
                if (data.value.type == ClarityType.StringASCII)
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