import { CharName } from "@/styles/myStyledComponents";
import { getClientSSR } from "@/utils/apolloclient";
import { gql } from "@apollo/client"
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

type Char = {character:{
  name: string, 
  location:{name:string, id: string}, 
  gender: string,
  image: string,
  episode: {name: string, id: string}[]
}};
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
              name,
              id
            }
            gender,
            image,
            episode{
              name,
              id
            },
        }
    }
  `;

  const client = getClientSSR();
  const {data} = await client.query<Char>({
    query
  });

  if(!data.character.name){
    return {
      notFound: true,
    }
  }

  console.log(data.character.location.id)

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
        <Image src={props.data.character.image} alt={props.data.character.name} width={400} height={400}></Image>
        <CharName>name: {props.data.character.name}</CharName>
        <CharName>location: <Link className="greenLink" href={`/location/${props.data.character.location.id}`}>{props.data.character.location.name}</Link></CharName>
        <CharName>gender: {props.data.character.gender}</CharName>
        <CharName>episodes:</CharName>
        {
          props.data.character.episode.map(ep => {
            return (
              <>
                <li><Link className="greenLink" href={`/episode/${ep.id}`}>{ep.name}</Link></li>
              </>
            )
          })
        }
    </div>
  )
}
