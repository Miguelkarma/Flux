import styled from "styled-components";

const StartButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <StyledWrapper>
      <button onClick={onClick}>I'M READY</button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    --cyan: #00ffff; /* or #80eaff for a softer look */
    font-size: 15px;
    padding: 0.7em 2.7em;
    letter-spacing: 0.06em;
    position: relative;
    font-family: inherit;
    border-radius: 0.6em;
    overflow: hidden;
    transition: all 0.3s;
    line-height: 1.4em;
    border: 2px solid var(--cyan);
    background: linear-gradient(
      to right,
      rgba(0, 255, 255, 0.1) 1%,
      transparent 40%,
      transparent 60%,
      rgba(0, 255, 255, 0.1) 100%
    );
    color: var(--cyan);
    box-shadow: inset 0 0 10px rgba(0, 255, 255, 0.4),
      0 0 9px 3px rgba(0, 255, 255, 0.1);
  }

  button:hover {
    color: #c4c9f0;
    box-shadow: inset 0 0 10px rgba(170, 177, 229, 0.6),
      0 0 9px 3px rgba(170, 177, 229, 0.2);
  }

  button:before {
    content: "";
    position: absolute;
    left: -4em;
    width: 4em;
    height: 100%;
    top: 0;
    transition: transform 0.4s ease-in-out;
    background: linear-gradient(
      to right,
      transparent 1%,
      rgba(170, 177, 229, 0.1) 40%,
      rgba(170, 177, 229, 0.1) 60%,
      transparent 100%
    );
  }

  button:hover:before {
    transform: translateX(15em);
  }
`;

export default StartButton;
