import { useRouter } from 'next/router'
import { MainMenu } from '@/styles/myStyledComponents'
import { useEffect, useState } from 'react';
import LoadingIcon from '@/components/loadingIcon';


export default function Home() {
    
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const handleStart = (url:string) => (url !== router.asPath) && setLoading(true);
        const handleComplete = (url:string) => (url === router.asPath) && setLoading(false);

        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeComplete', handleComplete)
        router.events.on('routeChangeError', handleComplete)

        return () => {
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeComplete', handleComplete)
            router.events.off('routeChangeError', handleComplete)
        }
    })

    return(
      <MainMenu>
        {
          loading ? (
            <>
              <LoadingIcon></LoadingIcon>

            </>
          ) : (
            <>
             <button onClick={() => {router.push('/planets/1');}}>Go to planets page 1</button>
            </>
          )
        }
      </MainMenu>
    )
}
