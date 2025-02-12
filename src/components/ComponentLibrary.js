import useCalculatorStore from "../store/store";

const predefinedComponents = [
  { id: "num-1", label: "1", value: "1" },
  { id: "num-2", label: "2", value: "2" },
  { id: "num-3", label: "3", value: "3" },
  { id: "num-4", label: "4", value: "4" },
  { id: "num-5", label: "5", value: "5" },
  { id: "num-6", label: "6", value: "6" },
  { id: "num-7", label: "7", value: "7" },
  { id: "num-8", label: "8", value: "8" },
  { id: "num-9", label: "9", value: "9" },
  { id: "num-0", label: "0", value: "0" },
  { id: "op-add", label: "+", value: "+" },
  { id: "op-sub", label: "-", value: "-" },
  { id: "op-mul", label: "*", value: "*" },
  { id: "op-div", label: "/", value: "/" },
  { id: "op-equal", label: "=", value: "=" },
  { id: "op-clear", label: "C", value: "C" },
];

const ComponentLibrary = () => {
  const { addComponent } = useCalculatorStore();

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md">
      <h2 className="text-xl font-bold mb-2">Components</h2>
      <div className="grid grid-cols-4 gap-2">
        {predefinedComponents.map((comp) => (
          <button
            key={comp.id}
            className="p-2 bg-gray-200 rounded shadow-md"
            onClick={() => addComponent(comp)}
          >
            {comp.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ComponentLibrary;
