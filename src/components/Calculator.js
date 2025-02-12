import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import useCalculatorStore from "../store/store";

const DraggableButton = ({ component, index, moveButton, handleClick }) => {
  const [, ref] = useDrag({
    type: "button",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "button",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveButton(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      className={`col-${component.value === "=" ? "6" : "3"}`}
    >
      <button
        className={`btn btn-lg w-100 fw-bold ${
          component.value === "="
            ? "btn-success"
            : component.value === "C"
            ? "btn-danger"
            : ["+", "-", "*", "/"].includes(component.value)
            ? "btn-warning"
            : "btn-secondary"
        }`}
        onClick={() => handleClick(component.value)}
      >
        {component.label}
      </button>
    </div>
  );
};

const Calculator = () => {
  const { components, setComponents } = useCalculatorStore();
  const [input, setInput] = useState("");

  const handleClick = (value) => {
    setInput((prevInput) => {
      if (value === "=") {
        try {
          return prevInput ? eval(prevInput).toString() : "0";
        } catch {
          return "Error";
        }
      } else if (value === "C") {
        return "";
      } else {
        return prevInput + value;
      }
    });
  };

  const moveButton = (fromIndex, toIndex) => {
    const updatedComponents = [...components];
    const [movedItem] = updatedComponents.splice(fromIndex, 1);
    updatedComponents.splice(toIndex, 0, movedItem);
    setComponents(updatedComponents);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card bg-dark text-white p-3 shadow-lg" style={{ width: "300px" }}>
          {/* Display Screen */}
          <div className="form-control text-end fs-3 fw-bold bg-light text-dark p-3 mb-3 rounded">
            {input || "0"}
          </div>

          {/* Calculator Buttons */}
          <div className="row g-2">
            {components.map((component, index) => (
              <DraggableButton
                key={component.id}
                component={component}
                index={index}
                moveButton={moveButton}
                handleClick={handleClick}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Calculator;