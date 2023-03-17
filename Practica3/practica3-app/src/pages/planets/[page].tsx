import Menu from "@/components/menu";

type ServerSideProps = {
    params: {page: string}
}

type Planet = {name: string, url: string};

export async function getServerSideProps(props: ServerSideProps){
    let planetList: {name: string, id: string}[] = []
    const res = await fetch(`https://swapi.dev/api/planets/?page=${props.params.page}`);
    const json = await res.json();

    json.results.forEach((planet:Planet) => {
              let idArr = planet.url.split("/");
              planetList.push({name:planet.name, id:idArr[5]})
    })

    const hasPrev: boolean = json.previous != null;
    const hasNext: boolean = json.next != null;

    return {
        props: {
            planets: planetList,
            hasNext,
            hasPrev
        }
    }
}

type PageProps = {
    planets: {name: string, id: string}[],
    hasNext: boolean,
    hasPrev: boolean
}

export default function PlanetPage(props: PageProps){

    return(
        <>
        <Menu planets={props.planets} hasPrev={props.hasPrev} hasNext={props.hasNext}></Menu>
        </>
    )
}
