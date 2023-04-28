import { ButtonContainer, CharDiv, CharName, CharsWrap, CurrentPage } from "@/styles/myStyledComponents";
import { clientCSR } from "@/utils/apolloclient";
import { gql } from "@apollo/client"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

    const [episode, setEpisode] = useState<{
        name: string, 
        air_date: string, 
        characters: {name: string, id: string}[]
    }>();

    const fetchChar = async (id: string) => {
        const query = gql`
        query{
            episode(id: ${id}){
              name,
              air_date,
              characters{
                name,
                id
              }
            }
          }
        `;

        const {data} = await clientCSR.query<GraphQLResponse>({
            query
        });

        setEpisode(data.episode)
    }

    useEffect(() => {fetchChar(props.id)}, []);

    if(!episode?.name){
        return(
            <>
              <h1>Loading</h1>
            </>
        )
    }

    return (
        <>
            <CharName>title: {episode.name}</CharName>
            <CharName>air date: {episode.air_date}</CharName>
            <CharName>characters:</CharName>
            {
                episode.characters.map(char => {
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
