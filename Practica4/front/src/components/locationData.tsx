import { useRouter } from "next/router";
import Link from "next/link";
import { CharName } from "@/styles/myStyledComponents";
import { useState } from "react";
import Loader from "./loader";

type Location = {location:{
    name: string, 
    dimension: string,
    residents: {name: string, id: string}[]
  }};

export default function LocationData(props: {data: Location}){
    const router = useRouter()

    const [serverLoading, setServerLoading] = useState<boolean>(false);

    if(router.isFallback || serverLoading){
        return(
        <>
        <Loader></Loader>
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
                    <li><Link onClick={() => setServerLoading(true)} className="greenLink" href={`/character/${char.id}`}>{char.name}</Link></li>
                </>
                )
            })
            }
        </div>
    )
}