
import LocationData from "@/components/locationData";
import { getClientSSR } from "@/utils/apolloclient";
import { gql } from "@apollo/client"


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
    return(
        <>
        <LocationData data={props.data}></LocationData>
        </>
    )
}
