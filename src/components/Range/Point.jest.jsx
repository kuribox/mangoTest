import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import Point from "./Point";

afterEach(cleanup);

const defaultProps = {
  name: "test",
  min: 1,
  max: 100,
  step: 1,
  offset: 0,
  pointWidth: 30,
  width: 300,
  defaultValue: 1,
  onChange: jest.fn(),
};

describe("Point component", () => {
  it("renders the component correctly", () => {
    const { getByTestId } = render(<Point {...defaultProps} />);

    const point = getByTestId("point-test");

    expect(point).toBeInTheDocument();
  });

  it("handles mouse down and mouse up to 200 correctly with Values input", async () => {
    const { getByTestId } = await render(
      <Point {...defaultProps} values={[0, 1, 2]} />
    );

    let point = getByTestId("point-test");

    fireEvent.mouseDown(point);
    fireEvent.mouseMove(point, { clientX: 200 });
    fireEvent.mouseUp(point, { clientX: 200 });

    const value = (defaultProps.width - defaultProps.pointWidth) / 2;
    expect(point).toHaveStyle(`left: ${value.toFixed(2)}px`);
    expect(defaultProps.onChange).toHaveBeenCalledWith(
      1,
      value + defaultProps.pointWidth
    );
  });

  it("handles mouse down and mouse up to 200 correctly", async () => {
    const { getByTestId } = await render(<Point {...defaultProps} />);

    let point = getByTestId("point-test");

    fireEvent.mouseDown(point);
    fireEvent.mouseMove(point, { clientX: 200 });
    fireEvent.mouseUp(point, { clientX: 200 });

    expect(point).toHaveStyle(`left: 185.45px`);
    expect(defaultProps.onChange).toHaveBeenCalledWith(
      69,
      185.45 + defaultProps.pointWidth
    );
  });

  it("handles mouse down and mouse up to 100 correctly", async () => {
    const { getByTestId } = await render(<Point {...defaultProps} />);

    let point = getByTestId("point-test");

    fireEvent.mouseDown(point);
    fireEvent.mouseMove(point, { clientX: 100 });
    fireEvent.mouseUp(point, { clientX: 100 });

    expect(point).toHaveStyle(`left: 84.55px`);
    expect(defaultProps.onChange).toHaveBeenCalledWith(
      32,
      84.55 + defaultProps.pointWidth
    );
  });

  it("handles mouse down and mouse up to 0 correctly", async () => {
    const { getByTestId } = await render(<Point {...defaultProps} />);

    let point = getByTestId("point-test");

    fireEvent.mouseDown(point);
    fireEvent.mouseMove(point, { clientX: 3 });
    fireEvent.mouseUp(point, { clientX: 3 });

    expect(point).toHaveStyle(`left: 0.00px`);
    expect(defaultProps.onChange).toHaveBeenCalledWith(
      1,
      defaultProps.pointWidth
    );
  });

  it("handles mouse down and mouse up to less min", async () => {
    const { getByTestId } = await render(<Point {...defaultProps} />);

    let point = getByTestId("point-test");

    fireEvent.mouseDown(point);
    fireEvent.mouseMove(point, { clientX: -10 });
    fireEvent.mouseUp(point, { clientX: -10 });

    expect(point).toHaveStyle(`left: 0.00px`);
    expect(defaultProps.onChange).toHaveBeenCalledWith(
      1,
      defaultProps.pointWidth
    );
  });

  it("handles mouse down and mouse up to more max", async () => {
    const { getByTestId } = await render(<Point {...defaultProps} />);

    let point = getByTestId("point-test");

    fireEvent.mouseDown(point);
    fireEvent.mouseMove(point, { clientX: 500 });
    fireEvent.mouseUp(point, { clientX: 500 });

    expect(point).toHaveStyle(
      `left: ${(defaultProps.width - defaultProps.pointWidth).toFixed(2)}px`
    );
    expect(defaultProps.onChange).toHaveBeenCalledWith(
      defaultProps.max,
      defaultProps.width
    );
  });

  it("handles limitMax correctly", async () => {
    const { getByTestId } = await render(
      <Point {...defaultProps} limitMax={200} />
    );

    const point = getByTestId("point-test");

    fireEvent.mouseDown(point);
    fireEvent.mouseMove(point, { clientX: 250 });
    fireEvent.mouseUp(point, { clientX: 250 });

    expect(point).toHaveStyle(
      `left: ${199.09 - 2.73 - defaultProps.pointWidth}px`
    );
    expect(defaultProps.onChange).toHaveBeenCalledWith(62, 199.09 - 2.73);
  });

  it("handles limitMin correctly", async () => {
    const { getByTestId } = await render(
      <Point {...defaultProps} limitMin={100} />
    );

    const point = getByTestId("point-test");

    fireEvent.mouseDown(point);
    fireEvent.mouseMove(point, { clientX: 50 });
    fireEvent.mouseUp(point, { clientX: 50 });

    expect(point).toHaveStyle(
      `left: ${100.91 + 2.73 - defaultProps.pointWidth}px`
    );
    expect(defaultProps.onChange).toHaveBeenCalledWith(28, 100.91 + 2.73);
  });

  it("updates the component when value prop changes", () => {
    const { getByTestId, rerender } = render(<Point {...defaultProps} />);

    const point = getByTestId("point-test");

    rerender(<Point {...defaultProps} value={100} />);

    expect(point).toHaveStyle(
      `left: ${(defaultProps.width - defaultProps.pointWidth).toFixed(2)}px`
    );
  });
});
