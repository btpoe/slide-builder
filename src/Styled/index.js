import styled from 'styled-components';

export const Container = styled.div`
display: flex;
height: 100%;
`;

export const IframeContainer = styled.div`
height: 100%;
overflow: hidden;
position: relative;
width: 100%;
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

export const DataContainer = styled.div`
flex-shrink: 0;
overflow: auto;
padding: 20px 20px 0;
width: 400px;

& .form-group {
  overflow: hidden;
}
`;

export const SubmitWrap = styled.div`
background: #fff;
border-top: 1px solid #ccc;
bottom: 0;
padding: 20px 0;
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
