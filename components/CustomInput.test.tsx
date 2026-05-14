import React from "react";
import { render, screen } from "@testing-library/react-native";
import CustomInput from "./CustomInput"; 

describe("CustomInput Component", () => {
  
  const defaultProps = {
    placeholder: "Enter your name",
    value: "",
    onChangeText: jest.fn(), 
    
    error: null,
    isTouched: false,
  };

  it("renders placeholder correctly", () => {
    render(<CustomInput {...defaultProps} />);

    expect(screen.getByPlaceholderText("Enter your name")).toBeTruthy();
  });

 

  it("changes border color to red when there is an error", () => {
    const errorProp = { message: "Error" };

    render(
      <CustomInput {...defaultProps} error={errorProp}  />,
    );

    const input = screen.getByPlaceholderText("Enter your name");

   
    expect(input.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ borderColor: "red" })]),
    );
  });

  it("changes border color to green when isTouched is true and no error", () => {
    render(<CustomInput {...defaultProps} value="Mayar" error={null} />);

    const input = screen.getByPlaceholderText("Enter your name");

    expect(input.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ borderColor: "green" }),
      ]),
    );
  });
});
