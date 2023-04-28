import { ButtonContainer, CharDiv, CharName, CharsWrap, CurrentPage } from "@/styles/myStyledComponents";
import { clientCSR } from "@/utils/apolloclient";
import { gql } from "@apollo/client"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";


type GraphQLResponse = {characters:{results: Array<{name: string, image: string, id: string}>, info:{prev: number, next: number}}};


export default function CharClient() {

    const [page, setPage] = useState<number>(1);

    const [chars, setChars] = useState<{name: string, image: string, id: string}[]>([]);

    const [prev, setPrev] = useState<number|null>(null);
    const [next, setNext] = useState<number|null>(null);
    
    const [searchName, setSearchName] = useState<string>("");
  
    const fetchChar = async (page: number, name: string) => {
        const query = gql`
        query{
            characters(page: ${page}, filter:{name: "${name}"}){
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

        const {data} = await clientCSR.query<GraphQLResponse>({
            query
        });

        setChars(data.characters.results);
        setPrev(data.characters.info.prev);
        setNext(data.characters.info.next);
    }

    useEffect(() => {fetchChar(page, searchName)}, [page]);

    if(chars.length === 0){
        return(
            <>
              <h1>Loading</h1>
            </>
        )
    }

    return (
        <>
        <ButtonContainer>
            <input placeholder="Rick.." onChange={(e) => {setSearchName(e.target.value)}}></input>
            <button onClick={() => {
                if(page === 1){
                    fetchChar(page, searchName);
                } else {
                    setPage(1);
                }
            }}>search</button>
        </ButtonContainer>
        <CharsWrap>
        {
            chars.map(char => (
                <>
                <CharDiv>
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
                prev && <button onClick={() => setPage(prev)}>prev</button>
            }
            <CurrentPage>{page}</CurrentPage>
            {
                next && <button onClick={() => setPage(next)}>next</button>
            }
        </ButtonContainer>
        </>
    )
}
