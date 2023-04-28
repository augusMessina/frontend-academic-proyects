import { useRouter } from "next/router"
import Loader from "./loader"
import Image from "next/image";
import Link from "next/link";
import { CharName } from "@/styles/myStyledComponents";
import { useState } from "react";

type Char = {character:{
    name: string, 
    location:{name:string, id: string}, 
    gender: string,
    image: string,
    episode: {name: string, id: string}[]
  }};

export default function CharData(props:{data: Char}){
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
            <Image src={props.data.character.image} alt={props.data.character.name} width={400} height={400}></Image>
            <CharName>name: {props.data.character.name}</CharName>
            <CharName>location: <Link onClick={() => setServerLoading(true)} className="greenLink" href={`/location/${props.data.character.location.id}`}>{props.data.character.location.name}</Link></CharName>
            <CharName>gender: {props.data.character.gender}</CharName>
            <CharName>episodes:</CharName>
            {
            props.data.character.episode.map(ep => {
                return (
                <>
                    <li><Link onClick={() => setServerLoading(true)} className="greenLink" href={`/episode/${ep.id}`}>{ep.name}</Link></li>
                </>
                )
            })
            }
        </div>
    )
}