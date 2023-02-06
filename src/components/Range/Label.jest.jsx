import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import Label from "./Label";

afterEach(cleanup);

const defaultProps = {
  name: "test",
  text: "test",
  suffix: "$",
  enableEdit: false,
  onChange: jest.fn(),
};

describe("Label component", () => {
  it("renders the component correctly", () => {
    const { getByTestId } = render(<Label {...defaultProps} />);

    const point = getByTestId("label-test");

    expect(point).toBeInTheDocument();
  });

  it("renders enable edit input", () => {
    const { getByTestId } = render(<Label {...defaultProps} enableEdit />);

    const point = getByTestId("label-test");

    fireEvent.click(point);

    const input = getByTestId("label-input");

    expect(input).toBeInTheDocument();
  });

  it("renders disabled edit input", () => {
    const { getByTestId, queryByTestId } = render(<Label {...defaultProps} />);

    const point = getByTestId("label-test");

    fireEvent.click(point);

    expect(queryByTestId("label-input")).toBeNull();
  });

  it("change input fire onchange", () => {
    const { getByTestId } = render(<Label {...defaultProps} enableEdit />);

    const point = getByTestId("label-test");

    fireEvent.click(point);

    const input = getByTestId("label-input");

    fireEvent.change(input, { target: { value: "50" } });

    fireEvent.keyDown(input, { key: "Enter", keyCode: 13 });

    expect(defaultProps.onChange).toHaveBeenCalledWith("50");
  });
});
