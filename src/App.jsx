import { useState } from 'react';
import './App.css';

// Import the WebAssembly and JS files
import WebAssemblyBinary from './wasm/bubble_sort.wasm';

function App() {
  const [numbers, setNumbers] = useState({
    a: 0,
    b: 0,
  });
  const [result, setResult] = useState(0);

  // Load WebAssembly
  const loadWasm = async () => {
    const wasmModule = await WebAssembly.instantiateStreaming(fetch(WebAssemblyBinary), {
      env: {
        // You can add imports if needed
      }
    });
    return wasmModule.instance.exports;
  };

  const handleClick = async () => {
    const wasmCore = await loadWasm();

    // Ensure numbers are converted to integers
    const res = wasmCore.adder(Number(numbers.a), Number(numbers.b));
    setResult(res);
  };

  return (
    <div className="App">
      <input
        type="text"
        onChange={(e) => setNumbers({ ...numbers, a: e.target.value })}
      />
      <input
        type="text"
        onChange={(e) => setNumbers({ ...numbers, b: e.target.value })}
      />
      <button onClick={handleClick}>Add</button>
      <div className="bg-red-300">{result}</div>
    </div>
  );
}

export default App;