import { useState } from "react"
import styled from "styled-components"

const AddRow = () => {
    const [Nombre, setNombre] = useState<string>("");
    const [DNI, setDNI] = useState<string>("");



    function addRow():void {

    }

    return(
        <>
            <AddRowDiv>
                <input placeholder="Nombre" onChange={(e) => setNombre(e.target.value)}></input>
                <input placeholder="DNI" onChange={(e) => setDNI(e.target.value)}></input>
                <button onClick={addRow}>Añadir</button>
            </AddRowDiv>
        </>
    )
}

const AddRowDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-self: center;
`

export default AddRow;