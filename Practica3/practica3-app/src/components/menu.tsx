import Link from "next/link";
import { MainMenu, PlanetsMenu } from "@/styles/myStyledComponents";
import { useRouter } from "next/router";
import { useState } from "react";

type PageProps = {
    planets: {name: string, id: string}[],
    hasPrev: boolean,
    hasNext: boolean
  }

const Menu = (props: PageProps) => {

    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    return(
        <MainMenu>
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
                        <button onClick={() => {router.push(`/planets/${parseInt(window.location.pathname.split("/")[2])-1}`);}}>ANTERIOR</button>
                    </>
                )
            }
            {
                props.hasNext && (
                    <>
                        <button onClick={() => {router.replace(`/planets/${parseInt(window.location.pathname.split("/")[2])+1}`);}}>SIGUIENTE</button>
                    </>
                )
            }
        </div>
        </MainMenu>
    )
}
export default Menu;