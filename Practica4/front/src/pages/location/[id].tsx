import { CharName } from "@/styles/myStyledComponents";
import { getClientSSR } from "@/utils/apolloclient";
import { gql } from "@apollo/client"
import { useRouter } from "next/router";
import Link from "next/link";

type Location = {location:{
  name: string, 
  dimension: string,
  residents: {name: string, id: string}[]
}};

type ServerSideProps = {
    params: {id: string}
}

export const getServerSideProps = async (props: ServerSideProps) => {
  const query = gql`
  query{
    location(id:${props.params.id}){
      name,
      dimension,
      residents{
        name,
        id
      }
    }
  }
  `;

  const client = getClientSSR();
  const {data} = await client.query<Location>({
    query
  });

  return {
    props: {
      data: data
    }
  }
}

export default function Char(props: {data: Location}) {

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
        <CharName>name: {props.data.location.name}</CharName>
        <CharName>dimension: {props.data.location.dimension}</CharName>
        <CharName>residents:</CharName>
        {
          props.data.location.residents.map(char => {
            return (
              <>
                <li><Link className="greenLink" href={`/character/${char.id}`}>{char.name}</Link></li>
              </>
            )
          })
        }
    </div>
  )
}
