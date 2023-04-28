import { CharName } from "@/styles/myStyledComponents";
import { getClientSSR } from "@/utils/apolloclient";
import { gql } from "@apollo/client"
import { useRouter } from "next/router";

type Char = {character:{name: string, location:{name:string}, gender: string}};
type Chars = {characters:{results: Array<{id: string}>, info:{next: number}}};

type ServerSideProps = {
    params: {id: string}
}

export const getStaticPaths = async () => {

  const paths: {params: {id: string}}[] = [];

  const fetchIds = async (page: number) => {
    const query = gql`
      query{
        characters(page: ${page}){
          results{
            id
          }
          info{
            next
          }
        }
      }
    `;

    const client = getClientSSR();
    const {data} = await client.query<Chars>({
      query
    });

    // data.characters.results.forEach(char => paths.push({params:{id:char.id}}));

    data.characters.results.forEach(char => {
      paths.push({params:{id:char.id}})
    })

    return data.characters.info.next;
  }

  let page: number | null = 1

  while(page){
    page = await fetchIds(page);
  }

  // await fetchIds(1);

  console.log(paths)

  return {
    paths,
    fallback: true
  }

}

export const getStaticProps = async (props: ServerSideProps) => {
  const query = gql`
    query{
        character(id: ${props.params.id}){
            name,
            location{
              name
            }
            gender
        }
    }
  `;

  const client = getClientSSR();
  const {data} = await client.query<Char>({
    query
  });

  return {
    props: {
      data: data
    }
  }
}

export default function Char(props: {data: Char}) {

  const router = useRouter()

  if(router.isFallback){
    return(
    <>
      <h1>Loading</h1>
    </>
    )
  }
  
  return (
    <div>
        <CharName>name: {props.data.character.name}</CharName>
        <CharName>location: {props.data.character.location.name}</CharName>
        <CharName>gender: {props.data.character.gender}</CharName>
    </div>
  )
}
