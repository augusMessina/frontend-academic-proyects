import Loader from "@/components/loader";
import { ButtonContainer, CharDiv, CharName, CharsWrap, CurrentPage } from "@/styles/myStyledComponents";
import { gql, useQuery } from "@apollo/client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";


type GraphQLResponse = {characters:{results: Array<{name: string, image: string, id: string}>, info:{prev: number, next: number}}};



export default function CharsFlex() {
    const [page, setPage] = useState<number>(1);

    const [searchName, setSearchName] = useState<string>("");
    const [inputName, setInputName] = useState<string>("");

    const [serverLoading, setServerLoading] = useState<boolean>(false);

    const query = gql`
        query characters($page: Int, $searchName: String){
            characters(page: $page, filter:{name: $searchName}){
              results{
                name,
                image,
                id
              },
              info{
                prev,
                next
              }
            }
          }
        `;

    const { data, loading, error } = useQuery<GraphQLResponse>(query, {
        variables:{
            page,
            searchName
        }
    });

    if(loading || serverLoading){
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
        <ButtonContainer>
            <input placeholder="Rick.." onChange={(e) => {setInputName(e.target.value)}}></input>
            <button onClick={() => {
                setPage(1);
                setSearchName(inputName);
            }}>search</button>
        </ButtonContainer>
        <CharsWrap>
        {
            data?.characters.results.map(char => (
                <>
                <CharDiv onClick={() => setServerLoading(true)}>
                    <Link className="link" href={`/character/${char.id}`}>
                        <Image src={char.image} alt={char.name} width={300} height={300}></Image>
                        <CharName>{char.name}</CharName>
                    </Link>
                </CharDiv>
                </>
            ))
        }
        </CharsWrap>
        <ButtonContainer>
            {
                data?.characters.info.prev && <button onClick={() => setPage(data.characters.info.prev)}>prev</button>
            }
            <CurrentPage>{page}</CurrentPage>
            {
                data?.characters.info.next && <button onClick={() => setPage(data.characters.info.next)}>next</button>
            }
        </ButtonContainer>
        </>
    )
}