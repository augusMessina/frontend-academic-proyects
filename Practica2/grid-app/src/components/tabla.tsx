import { useState } from "react";
import Image from "next/image";
import { isValidNif } from "nif-dni-nie-cif-validation";
import { GridItem, RemoveRowButton, ColumnName, 
    InputsDiv, Menu, Wrapper, AddRowsDiv, 
    AddColumnButton, ColumnDiv, RemoveColumnButton } from "../styles/myStyledComponents";

const Tabla = () => {
    type Row = {
        nombre: string,
        DNI: string
    }
    const [rows, setRows] = useState<string[][]>([]);
    const [columns, setColumns] = useState<string[]>(["NOMBRE", "DNI"]);
    const [newRow, setNewRow] = useState<string[]>(["", ""]);
    const [Nombre, setNombre] = useState<string>("");
    const [DNI, setDNI] = useState<string>("");
    const [ErrorNombre, setErrorNombre] = useState<string>("");
    const [ErrorDNI, setErrorDNI] = useState<string>("");

    function addRow(){
            console.log(newRow)
            setRows([...rows, newRow]);
            setNombre("");
            setDNI("");
        
    }


    return(
        <>
        <Menu>
            <Wrapper columns={columns.length}>
                {/* <p className="rowName">NOMBRE</p>
                <p className="rowName">DNI</p> */}

                {/* <ColumnName>NOMBRE</ColumnName>
                <ColumnName>DNI</ColumnName> */}


                {
                    columns.map((column, index) => (
                        <>
                        <ColumnDiv>
                            <ColumnName defaultValue={column} onChange={(e) => setColumns(
                                columns.map((column, i) => {
                                    if(i===index){
                                        return e.target.value;
                                    } else {return column}
                                })
                            )}>
                            </ColumnName>
                            <RemoveColumnButton onClick={() => {
                                setColumns(columns.filter((column, i) => !(i===index)));
                                setNewRow(newRow.filter((value, i) => !(i===index)));
                            }}>X</RemoveColumnButton>
                        </ColumnDiv>
                        </>
                    ))
                }

                {
                    (columns.length < 5) && <AddColumnButton row={1} column={columns.length+1} onClick={() => {
                        setColumns([...columns, "NEW COLUMN"]);
                        setNewRow([...newRow, ""])
                    }}>
    
                        <Image width={20} height={20} src="/add-43.png" alt=""></Image>
                    </AddColumnButton>
                }

                

                {
                    rows.map((row, index) => (
                        <>
                            {
                                row.map(item => (
                                    <>
                                    <GridItem row={index+2}>{item}</GridItem>
                                    </>
                                ))
                            }
                            {/* <GridItem row={index+2}>{row.nombre}</GridItem>
                            <GridItem row={index+2}>{row.DNI}</GridItem> */}
                            <RemoveRowButton row={index+2} column={columns.length+1} onClick={() => {
                                setRows(rows.filter((row, i) => !(i===index)));}}>
                                <Image width={20} height={20} src="/trash.png" alt=""></Image>

                            </RemoveRowButton>
                        </>
                    )) 
                }
  
            </Wrapper>
            <AddRowsDiv>
                <InputsDiv>
                    {
                        columns.map((column, index) => (
                            <>
                            <input placeholder={column} onChange={(e) => setNewRow(
                                newRow.map((value, i) => {
                                    if(i===index){
                                        return e.target.value;
                                    } else {return value}
                                })
                            )}></input>
                            </>
                        ))
                    }
                    {/* <input placeholder="Nombre" value={Nombre} onChange={(e) => setNombre(e.target.value)}></input>
                    <input placeholder="DNI" value={DNI} onChange={(e) => setDNI(e.target.value)}></input> */}
                    <button onClick={()=>addRow()}>Añadir</button>
                </InputsDiv>
            </AddRowsDiv>
            
        </Menu>
        </>
        
    )
}

export default Tabla;