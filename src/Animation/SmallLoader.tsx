import styled from "styled-components";

const SmallLoader = () => {
  return (
    <StyledWrapper>
      <div className="pyramid-loader">
        <div className="wrapper">
          <span className="side side1" />
          <span className="side side2" />
          <span className="side side3" />
          <span className="side side4" />
          <span className="shadow" />
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .pyramid-loader {
    position: relative;
    width: 300px;
    height: 150px;
    display: block;
    transform-style: preserve-3d;
    transform: rotateX(-20deg);
  }

  .wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    animation: spin 4s linear infinite;
  }

  @keyframes spin {
    100% {
      transform: rotateY(360deg);
    }
  }

  .pyramid-loader .wrapper .side {
    width: 70px;
    height: 70px;
    background: linear-gradient(to bottom right, #ffa500, #ff4500);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    transform-origin: center top;
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  }

  .pyramid-loader .wrapper .side1 {
    transform: rotateZ(-30deg) rotateY(90deg);
    background: rgb(25, 145, 124);
    background: linear-gradient(
      90deg,
      rgba(25, 145, 124, 1) 0%,
      rgba(68, 226, 200, 1) 48%,
      rgba(142, 245, 189, 1) 70%,
      rgba(192, 217, 200, 1) 100%
    );
  }

  .pyramid-loader .wrapper .side2 {
    transform: rotateZ(30deg) rotateY(90deg);
    background: rgb(25, 145, 124);
    background: linear-gradient(
      90deg,
      rgba(25, 145, 124, 1) 0%,
      rgba(68, 226, 200, 1) 48%,
      rgba(142, 245, 189, 1) 70%,
      rgba(192, 217, 200, 1) 100%
    );
  }

  .pyramid-loader .wrapper .side3 {
    transform: rotateX(30deg);
    background: rgb(25, 145, 124);
    background: linear-gradient(
      90deg,
      rgba(25, 145, 124, 1) 0%,
      rgba(68, 226, 200, 1) 48%,
      rgba(142, 245, 189, 1) 70%,
      rgba(192, 217, 200, 1) 100%
    );
  }

  .pyramid-loader .wrapper .side4 {
    transform: rotateX(-30deg);
    background: rgb(25, 145, 124);
    background: linear-gradient(
      90deg,
      rgba(25, 145, 124, 1) 0%,
      rgba(68, 226, 200, 1) 48%,
      rgba(142, 245, 189, 1) 70%,
      rgba(192, 217, 200, 1) 100%
    );
  }

  .pyramid-loader .wrapper .shadow {
    width: 60px;
    height: 60px;
    background: rgb(25, 145, 124);
    background: linear-gradient(
      90deg,
      rgba(25, 145, 124, 1) 0%,
      rgba(68, 226, 200, 1) 48%,
      rgba(142, 245, 189, 1) 70%,
      rgba(192, 217, 200, 1) 100%
    );
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    transform: rotateX(90deg) translateZ(-40px);
    filter: blur(12px);
  }
`;

export default SmallLoader;
