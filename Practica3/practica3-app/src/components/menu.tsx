import Link from "next/link";
import { MainMenu, PlanetsMenu } from "@/styles/myStyledComponents";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type PageProps = {
    planets: {name: string, id: string}[],
    hasPrev: boolean,
    hasNext: boolean
  }

const Menu = (props: PageProps) => {

    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const handleStart = (url:any) => (url !== router.asPath) && setLoading(true);
        const handleComplete = (url:any) => (url === router.asPath) && setLoading(false);

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
                    <h1>Cargando...</h1>
                </>
            ) :
            (
                <>
                    <PlanetsMenu> PLANETAS
                    {
                        props.planets.map(planet => (
                            <>
                            <Link key={planet.name} className="linkName" href={`http://localhost:3000/planet/${planet.id}`}>{planet.name}</Link>
                            </>
                        ))
                    }
                    </PlanetsMenu>
                    <div style={{display: "flex", flexDirection: "row", gap: "20px"}}>
                        {
                            props.hasPrev && (
                                <>
                                    <button onClick={() => {
                                        
                                        router.push(`/planets/${parseInt(window.location.pathname.split("/")[2])-1}`);
                                        
                                        }}>ANTERIOR</button>
                                </>
                            )
                        }
                        {
                            props.hasNext && (
                                <>
                                    <button onClick={() => {
                                        
                                        router.replace(`/planets/${parseInt(window.location.pathname.split("/")[2])+1}`);
                                        
                                        }}>SIGUIENTE</button>
                                </>
                            )
                        }
                    </div>
                </>
            )
        }


        
        </MainMenu>
    )
}
export default Menu;