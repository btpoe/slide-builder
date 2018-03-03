import DefaultForm from 'react-jsonschema-form';
import styled from 'styled-components';

export const Container = styled.div`
display: flex;
flex-direction: column;
height: 100%;
`;

export const IframeContainer = styled.div`
flex-shrink: 0;
height: 40vh;
overflow: hidden;
position: relative;
`;

export const Iframe = styled.iframe`
border: 0;
height: 600px;
left: 50%;
position: absolute;
top: 50%;
transform: translate(-50%, -50%);
transform-origin: center;
width: 100%;
`;

export const Form = styled(DefaultForm)`
flex-grow: 1;
margin-top: 20px;
overflow: auto;
`;

export const SubmitWrap = styled.div`
background: #fff;
border-top: 1px solid #ccc;
bottom: 0;
padding-top: 20px;
position: sticky;
`;

export const FileUpload = styled.button`
cursor: pointer;
position: relative;
z-index: 0;

& input {
  cursor: pointer;
  height: 100%;
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 10;
}
`;
