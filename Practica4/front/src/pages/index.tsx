import { CharName } from "@/styles/myStyledComponents";
import { getClientSSR } from "@/utils/apolloclient";
import { gql } from "@apollo/client"
import { GetServerSideProps } from "next"
import Link from "next/link";

type Chars = {characters:{results: Array<{id: string, name: string}>, info:{next: number}}};

export default function Home(props: {data: Chars}) {
  
  return (
    <>
      <CharName>go to <Link href={'/characters'}>characters</Link></CharName>
      
    </>
  )
}
