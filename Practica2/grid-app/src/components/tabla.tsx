import { useState, useEffect } from "react";
import styled from "styled-components";

const Tabla = () => {
    type Row = {
        nombre: string,
        DNI: string
    }
    const [rows, setRows] = useState<Row[]>([]);
    const [rowsModified, setRowsModified] = useState<boolean>(false);

    const [Nombre, setNombre] = useState<string>("");
    const [DNI, setDNI] = useState<string>("");

    function addRow(){
        if(Nombre!="" && DNI!=""){
            setRows([...rows, {nombre: Nombre, DNI: DNI}]);
            setNombre("");
            setDNI("");
        }
    }

    function removeRow(row: number){
        setRows(rows.splice(row, 1));
    }

    function addRowToGrid(){
        if(rowsModified===true){
            setRowsModified(false);
            return(
                rows.map(row => (
                    <>
                        <div className="gridItem">{row.nombre}</div>
                        <div className="gridItem">{row.DNI}</div>
                    </>
                )) 
            )
        }
    }

    return(
        <>
        <div className='menu'>
            <div className="wrapper">
                <p className="rowName">NOMBRE</p>
                <p className="rowName">DNI</p>

                {
                    rows.map((row, index) => (
                        <>
                            <GridItem row={index+2}>{row.nombre}</GridItem>
                            <GridItem row={index+2}>{row.DNI}</GridItem>
                            <RemoveRowButton row={index+2} onClick={() => {
                                let newRows = rows.filter((row, i) => !(i===index));
                                setRows(newRows);}}>X</RemoveRowButton>
                        </>
                    )) 
                }
  
            </div>
            <div className="addRowDiv">
                <input placeholder="Nombre" value={Nombre} onChange={(e) => setNombre(e.target.value)}></input>
                <input placeholder="DNI" value={DNI} onChange={(e) => setDNI(e.target.value)}></input>
                <button onClick={()=>addRow()}>Añadir</button>
            </div>
        </div>
        </>
        
    )
}

// const AddRowDiv = styled.div`
//     display: flex;
//     flex-direction: row;
//     align-self: center;
// `;

type RowProps = {
    row: number
}

const GridItem = styled.p<RowProps>`
    grid-row: ${(props) => props.row};
    border: 1px solid blue;
    text-align: center;
    padding: 15px;
    margin: 0;
`;

const RemoveRowButton = styled.button<RowProps>`
    grid-row: ${(props) => props.row};
    border: 2px solid red;
    background: none;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
        background: red;
        color: white;
    }
`;



export default Tabla;