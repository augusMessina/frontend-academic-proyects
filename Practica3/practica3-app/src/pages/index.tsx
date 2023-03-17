import { useRouter } from 'next/router'
import { MainMenu } from '@/styles/myStyledComponents'


export default function Home() {
    
  const router = useRouter();

    return(
      <MainMenu>
        <button onClick={() => {router.push('/planets/1');}}>Go to planets page 1</button>
      </MainMenu>
    )
}
