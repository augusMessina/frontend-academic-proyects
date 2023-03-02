import styled from "styled-components";

type RowProps = {
    row: number
}

export const Menu = styled.div`
    display: flex;
    flex-direction: column;
    gap: 100px;
`;

export const Wrapper = styled.div`
    margin-left: 100px;
    margin-right: 100px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 5px;
    grid-auto-rows: minmax(30px, auto);
    border: 5px solid black;
    padding: 10px;
`;

export const GridItem = styled.p<RowProps>`
    grid-row: ${(props) => props.row};
    border: 1px solid blue;
    text-align: center;
    line-height: 30px;
    padding: 15px;
    margin: 0;
    font-size: 18px;
`;

export const ColumnName = styled.p`
    border: 5px solid blue;
    text-align: center;
    padding: 20px;
    font-size: 20px;
    font-weight: 600;
    margin: 0;
`;

export const AddRowsDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-self: center;
    gap: 30px;
    text-align: center;
`;

export const InputsDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-self: center;
    gap: 10px;
`;

export const RemoveRowButton = styled.button<RowProps>`
    grid-row: ${(props) => props.row};
    border: 2px solid red;
    background-image: "/trash.png";
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
        background: red;
        color: white;
    }
`;

export const ErrorMessage = styled.p`
    color: red;
    font-weight: 600;
`;