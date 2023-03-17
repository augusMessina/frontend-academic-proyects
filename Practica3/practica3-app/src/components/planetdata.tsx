import { useEffect, useState } from "react";
import { MainMenu, PlanetsMenu } from "@/styles/myStyledComponents";
import { useRouter } from "next/router";
import LoadingIcon from "./loadingIcon";


type PlanetProps = {
    name: string,
    rotation_period: string,
    orbital_period: string,
    diameter: string, 
    climate: string, 
    gravity: string, 
    terrain: string, 
    surface_water: string, 
    population: string,
    residents: string[],
    films: string[] 
}    


const PlanetData = () => {

    const router = useRouter();

    const [data, setData] = useState<PlanetProps>({
        name: "",
        rotation_period: "",
        orbital_period: "",
        diameter: "", 
        climate: "", 
        gravity: "", 
        terrain: "", 
        surface_water: "", 
        population: "",
        residents: [""],
        films: [""] 
    });

    const [loading, setLoading] = useState<boolean>(false);

    async function fetchPlanetData() {
        const res = await fetch(`https://swapi.dev/api/planets/${window.location.pathname.split("/")[2]}/`);
        const json = await res.json();
        
        json.residents = await Promise.all(json.residents.map(async (residentURL: string) => {
            const res = await fetch(residentURL);
            const json = await res.json();
            return json.name;
        }))

        json.films = await Promise.all(json.films.map(async (filmURL: string) => {
            const res = await fetch(filmURL);
            const json = await res.json();
            return json.title;
        }))

        setData(json);
    }

    useEffect(() => {fetchPlanetData()}, []);

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
                (data.name === "" || loading) ? (
                    <>
                        <LoadingIcon></LoadingIcon>
                    </>
                ) : (
                    <>
                        <PlanetsMenu> INFO
                        <p>Nombre: {data.name}</p>
                        <p>Tiempo de rotación: {data.rotation_period}</p>
                        <p>Tiempo de órbita: {data.orbital_period}</p>
                        <p>Diámetro: {data.diameter}</p>
                        <p>Clima: {data.climate}</p>
                        <p>Gravedad: {data.gravity}</p>
                        <p>Terreno: {data.terrain}</p>
                        <p>Agua en superficie: {data.surface_water}</p>
                        <p>Habitantes: {data.population}</p>
                        </PlanetsMenu>
                        <PlanetsMenu>
                        RESIDENTES{
                            data.residents.map(resident => (
                                <>
                                    <p>{resident}</p>
                                </>
                            ))
                        }
                        </PlanetsMenu>
                        <PlanetsMenu>PELICULAS
                        {
                            data.films.map(film => (
                                <>
                                    <p>{film}</p>
                                </>
                            ))
                        }
                        </PlanetsMenu>
                        <div>
                            <button onClick={() => {router.back()}}>ATRÁS</button>
                        </div>
                    </>
                )
            }
            
        </MainMenu>
    )
}
export default PlanetData;