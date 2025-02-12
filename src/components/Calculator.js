import { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import useCalculatorStore from "../store/store";

const STORAGE_KEY = "calculatorLayout"; // LocalStorage Key

const DraggableButton = ({ component, index, moveButton, handleClick, isDarkMode }) => {
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
    <div ref={(node) => ref(drop(node))} className={`col-${component.value === "=" ? "6" : "3"}`}>
      <button
        className={`btn btn-lg w-100 fw-bold ${
          component.value === "="
            ? "btn-success"
            : component.value === "C"
            ? "btn-danger"
            : ["+", "-", "*", "/"].includes(component.value)
            ? "btn-warning"
            : isDarkMode
            ? "btn-light"
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
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [undoStack, setUndoStack] = useState([]); // Stores past states
  const [redoStack, setRedoStack] = useState([]); // Stores undone states

  useEffect(() => {
    const storedLayout = localStorage.getItem(STORAGE_KEY);
    if (storedLayout) {
      setComponents(JSON.parse(storedLayout));
    }
    document.body.className = isDarkMode ? "bg-dark text-white" : "bg-light text-dark";
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(components));
  }, [components]);

  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
    document.body.className = isDarkMode ? "bg-dark text-white" : "bg-light text-dark";
  }, [isDarkMode]);

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

    setUndoStack((prev) => [...prev, components]); // Save current state before moving
    setRedoStack([]); // Clear redo stack after a new change
    setComponents(updatedComponents);
  };

  const undo = () => {
    if (undoStack.length === 0) return;

    const prevState = undoStack.pop();
    setRedoStack((prev) => [...prev, components]); // Save current state in redo stack
    setComponents(prevState);
    setUndoStack([...undoStack]); // Update undo stack
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const nextState = redoStack.pop();
    setUndoStack((prev) => [...prev, components]); // Save current state in undo stack
    setComponents(nextState);
    setRedoStack([...redoStack]); // Update redo stack
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="vh-100 vw-100 d-flex justify-content-center align-items-center">
        <div className={`card ${isDarkMode ? "bg-dark text-white" : "bg-light text-dark"} p-3 shadow-lg`} style={{ width: "300px" }}>
          {/* Dark Mode Toggle */}
          <button className="btn btn-outline-secondary mb-3" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Undo/Redo Buttons */}
          <div className="d-flex justify-content-between mb-2">
            <button className="btn btn-outline-primary" onClick={undo} disabled={undoStack.length === 0}>Undo</button>
            <button className="btn btn-outline-primary" onClick={redo} disabled={redoStack.length === 0}>Redo</button>
          </div>

          {/* Display Screen */}
          <div className={`form-control text-end fs-3 fw-bold p-3 mb-3 rounded ${isDarkMode ? "bg-light text-dark" : "bg-dark text-white"}`}>
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
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Calculator;
