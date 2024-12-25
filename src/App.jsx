import React, { useState } from 'react';
import './App.css';
import WebAssemblyBinary from './wasm/bubble_sort.wasm';

const loadWasm = async () => {
  const wasmModule = await WebAssembly.instantiateStreaming(fetch(WebAssemblyBinary), {
    env: {
      memory: new WebAssembly.Memory({ initial: 256, maximum: 256 }),
    },
  });
  console.log(wasmModule.instance.exports);
  return wasmModule.instance.exports;
};

export default function App() {
  const [array, setArray] = useState([6, 8, 9, 1, 3, 7]);
  const [steps, setSteps] = useState([]);

  const handleSorting = async () => {
    const wasmCore = await loadWasm();
    const wasmMemory = new Int32Array(wasmCore.memory.buffer);
    const arraySize = array.length;
    const wasmArrayPtr = 100;

    for (let i = 0; i < arraySize; i++) {
      wasmMemory[wasmArrayPtr / 4 + i] = array[i];
    }

    const callback = (arrPtr, size) => {
      const currentArray = [];

      for (let i = 0; i < size; i++) {
        currentArray.push(wasmMemory[arrPtr / 4 + i]);
      }

      setSteps((prevSteps) => [...prevSteps, currentArray]);
    };

    wasmCore.buffer(wasmArrayPtr, arraySize, callback);
  };

  return (
    <main className='p-5 flex flex-col items-center'>
      <h1 className='text-3xl py-5'>Bubble Sort</h1>
      <button
        className='bg-purple-600 text-neutral-100 px-4 py-1 rounded-md'
        onClick={handleSorting}
      >
        Sort Array
      </button>
      <div className='py-5'>{array.join(", ")}</div>
    </main>
  );
}