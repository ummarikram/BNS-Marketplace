export default async function handler(req, res) {

    const { principal } = req.query;

    try {

        const response = await fetch(`https://stacks-node-api.testnet.stacks.co/extended/v1/tokens/nft/holdings?principal=${principal}&asset_identifiers=STYMF4ARBZEVT61CKV8RBQHC6NCGCAF7AQWH979K.custom-domain::AMORTIZE-DOMAIN`)

        const result = await response.json();

        res.status(200).send({ data: result.results })

    }

    catch (err) {
        res.status(405).send({ error: err })
    }
}