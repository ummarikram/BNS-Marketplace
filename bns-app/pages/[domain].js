import { useRouter } from 'next/router'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

const Domain = () => {
    const router = useRouter()
    const { domain } = router.query

    const { data, error } = useSWR(`/api/domainResolver?domain=${domain}`, fetcher)
    
    if (error) return <h1>Domain is Available!</h1>
    if (!data) return <h1></h1>
    
    // no redirecting
    if (data.data === 'none')
    {
        return ( <>
            <h>Domain: {domain} is Booked!</h>
            <br></br>
            <br></br>
            <br></br>
            <h>If you are the owner, you can set up routing vai Profile section</h>
            </>
        )
    }

    else
    {
        router.push(data.data)
    }

    return <h1></h1>
   
}

export default Domain