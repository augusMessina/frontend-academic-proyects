import { useState } from "react";
import Image from "next/image";
import { isValidNif } from "nif-dni-nie-cif-validation";
import { GridItem, RemoveRowButton, ColumnName, InputsDiv, Menu, Wrapper, AddRowsDiv, ErrorMessage } from "../styles/myStyledComponents";

const Tabla = () => {
    type Row = {
        nombre: string,
        DNI: string
    }
    const [rows, setRows] = useState<Row[]>([]);
    const [Nombre, setNombre] = useState<string>("");
    const [DNI, setDNI] = useState<string>("");
    const [ErrorNombre, setErrorNombre] = useState<string>("");
    const [ErrorDNI, setErrorDNI] = useState<string>("");

    function addRow(){
        if(Nombre!="" && DNI!=""){
            if(!(isValidNif(DNI))){
                setErrorDNI("El número de identificación no es válido. Se acepta NIF, DNI, NIE.")
            } else {
                setErrorDNI("");
            }
            
            
            if (!(/^[A-Za-z\s]*$/.test(Nombre))){
                setErrorNombre("El nombre solo puede contener letras y espacios.")
            } else {
                setErrorNombre("");
            }
            
            if(isValidNif(DNI) && (/^[A-Za-z\s]*$/.test(Nombre))) {
                setRows([...rows, {nombre: Nombre, DNI: DNI}]);
                setNombre("");
                setDNI("");
                setErrorNombre("");
            }
        }
    }


    return(
        <>
        <Menu>
            <Wrapper>
                {/* <p className="rowName">NOMBRE</p>
                <p className="rowName">DNI</p> */}

                <ColumnName>NOMBRE</ColumnName>
                <ColumnName>DNI</ColumnName>

                {
                    rows.map((row, index) => (
                        <>
                            <GridItem row={index+2}>{row.nombre}</GridItem>
                            <GridItem row={index+2}>{row.DNI}</GridItem>
                            <RemoveRowButton row={index+2} onClick={() => {
                                setRows(rows.filter((row, i) => !(i===index)));}}>
                                <Image width={20} height={20} src="/trash.png" alt=""></Image>

                            </RemoveRowButton>
                        </>
                    )) 
                }
  
            </Wrapper>
            <AddRowsDiv>
                <InputsDiv>
                    <input placeholder="Nombre" value={Nombre} onChange={(e) => setNombre(e.target.value)}></input>
                    <input placeholder="DNI" value={DNI} onChange={(e) => setDNI(e.target.value)}></input>
                    <button onClick={()=>addRow()}>Añadir</button>
                </InputsDiv>
                {
                    (ErrorNombre!="") && <ErrorMessage>{ErrorNombre}</ErrorMessage>
                }
                {
                    (ErrorDNI!="") && <ErrorMessage>{ErrorDNI}</ErrorMessage>
                }
            </AddRowsDiv>
            
        </Menu>
        </>
        
    )
}

export default Tabla;