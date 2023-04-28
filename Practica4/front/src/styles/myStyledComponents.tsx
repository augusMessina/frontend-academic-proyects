import styled from "styled-components"

export const CharsWrap = styled.div`
    padding: 10px;
    align-self: center;
    align-items: flex-start;
    justify-content: center;
    flex-wrap: wrap;
    gap: 100px;
    display: flex;
    width: auto;
    height: auto;
    border: 10px solid greenyellow;
`;

export const CharDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    cursor: pointer;  
`;

export const CharName = styled.p`
    color: white;
    font-weight: 600;
    font-size: 30px; 
    margin: 0; 
`;

export const ButtonContainer = styled.div`
    margin: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;  
`;

export const CurrentPage = styled.p`
    padding: 20px;
    width: 40px;
    border: 5px solid greenyellow;
    background: black;
    color: white;
    font-size: 30px;
    text-align: center;
`;