import React, { useEffect, useState, forwardRef } from "react";
import styled from "styled-components";
import { useTheme } from "@/hooks/ThemeProvider";
import { MoonStar, Sun } from "lucide-react";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Switch = forwardRef<HTMLInputElement, SwitchProps>((props, ref) => {
  const { theme, toggleTheme } = useTheme();
  const [isChecked, setIsChecked] = useState(theme === "light");

  useEffect(() => {
    setIsChecked(theme === "light");
  }, [theme]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    toggleTheme();
  };

  return (
    <StyledWrapper>
      <div>
        <label className="toggle" htmlFor="switch">
          <input
            id="switch"
            className="input"
            type="checkbox"
            checked={isChecked}
            onChange={handleChange}
            ref={ref}
            {...props}
          />
          <div className="icon icon--moon">
            <MoonStar className="text-cyan-400" />
          </div>
          <div className="icon icon--sun text-amber-500">
            <Sun />
          </div>
        </label>
      </div>
    </StyledWrapper>
  );
});

const StyledWrapper = styled.div`
  .toggle {
    background-color: Transparent;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: grid;
    place-items: center;
    cursor: pointer;
    box-shadow: 0 0 50px 20px rgba(0, 0, 0, 0.1);
    line-height: 1;
  }

  .input {
    display: none;
  }

  .icon {
    grid-column: 1 / 1;
    grid-row: 1 / 1;
    transition: transform 500ms;
  }

  .icon--moon {
    transition-delay: 200ms;
  }

  .icon--sun {
    transform: scale(0);
  }

  #switch:checked + .icon--moon {
    transform: rotate(360deg) scale(0);
  }

  #switch:checked ~ .icon--sun {
    transition-delay: 200ms;
    transform: scale(1) rotate(360deg);
  }
`;

export default Switch;
