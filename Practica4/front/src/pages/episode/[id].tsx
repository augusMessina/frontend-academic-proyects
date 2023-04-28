import Loader from "@/components/loader";
import { CharName } from "@/styles/myStyledComponents";
import { gql, useQuery } from "@apollo/client"
import Link from "next/link";


type ServerSideProps = {
    params: {id: string}
}

type GraphQLResponse = {episode:{
    name: string, 
    air_date: string,
    characters: {name: string, id: string}[]
}};

export const getServerSideProps = async (props: ServerSideProps) => {
    return {
      props: {
        id: props.params.id
      }
    }
}
  
export default function Episode(props: {id: string}) {

    const query = gql`
    query episode($id: ID!){
        episode(id: $id){
          name,
          air_date,
          characters{
            name,
            id
          }
        }
      }
        `;

    const { data, loading, error } = useQuery<GraphQLResponse>(query, {
        variables:{
            id: props.id
        }
    });

    if(loading){
        return(
            <>
            <Loader></Loader>
            </>
        )
    }

    if(error){
        return(
            <>
            <CharName>Ehmmm, looks like something went wrong :D</CharName>
            </>
        )
    }

    return (
        <>
            <CharName>title: {data?.episode.name}</CharName>
            <CharName>air date: {data?.episode.air_date}</CharName>
            <CharName>characters:</CharName>
            {
                data?.episode.characters.map(char => {
                    return (
                    <>
                        <li><Link className="greenLink" href={`/character/${char.id}`}>{char.name}</Link></li>
                    </>
                    )
                })
            }
        </>
    )
}
