import { useState } from "react";
import Image from "next/image";
import { GridItem, RemoveRowButton, ColumnName, 
    InputsDiv, Menu, Wrapper, AddRowsDiv, 
    AddColumnButton, ColumnDiv, RemoveColumnButton } from "../styles/myStyledComponents";

const Tabla = () => {

    const [rows, setRows] = useState<string[][]>([]);
    const [columns, setColumns] = useState<string[]>(["NOMBRE", "DNI"]);
    const [newRow, setNewRow] = useState<string[]>(["", ""]);

    return(
        <>
        <Menu>
            <Wrapper columns={columns.length}>

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
                                setColumns(columns.filter((column, i) => (i!=index)));
                                setNewRow(newRow.filter((value, i) => (i!=index)));
                                setRows(rows.map((row, i) => row.filter((item, i) => (i!=index))))
                            }}>X</RemoveColumnButton>
                        </ColumnDiv>
                        </>
                    ))
                }

                {
                    (columns.length < 4) && <AddColumnButton row={1} column={columns.length+1} onClick={() => {
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
                            <RemoveRowButton row={index+2} column={columns.length+1} onClick={() => {
                                setRows(rows.filter((row, i) => (i!=index)));}}>
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
                    <button onClick={()=> setRows([...rows, newRow])}>Añadir</button>
                </InputsDiv>
            </AddRowsDiv>
            
        </Menu>
        </>
        
    )
}

export default Tabla;