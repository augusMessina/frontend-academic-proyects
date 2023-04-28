import EpisodeData from "@/components/episodeData"


type ServerSideProps = {
    params: {id: string}
}

export const getServerSideProps = async (props: ServerSideProps) => {
    return {
      props: {
        id: props.params.id
      }
    }
}
  
export default function Episode(props: {id: string}) {
    return(
        <>
        <EpisodeData id={props.id}></EpisodeData>
        </>
    )    
}
