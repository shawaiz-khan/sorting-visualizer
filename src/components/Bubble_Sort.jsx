import React, { useState } from 'react';
import useWasm from '../hooks/useWasm';

export default function BubbleSortComponent() {
    const { wasmModule, loading, error } = useWasm();
    const [array, setArray] = useState([3, 8, 6, 23, 9, 12, 34, 2]);
    const [sortedArray, setSortedArray] = useState([]);

    const handleSorting = () => {
        if (!wasmModule) return;

        const wasmMemory = new Int32Array(wasmModule.memory.buffer);
        const arraySize = array.length;
        const arrayPtr = wasmModule.getArrayPointer ? wasmModule.getArrayPointer() : 100;

        for (let i = 0; i < arraySize; i++) {
            wasmMemory[arrayPtr / 4 + i] = array[i];
        }

        wasmModule.bubbleSort(arrayPtr, arraySize);

        const sorted = [];
        for (let i = 0; i < arraySize; i++) {
            sorted.push(wasmMemory[arrayPtr / 4 + i]);
        }

        setSortedArray(sorted);
    };

    if (loading) return <div>Loading WASM module...</div>;
    if (error) return <div>Error loading WASM module: {error.message}</div>;

    return (
        <div>
            <h1>Bubble Sort</h1>
            <button onClick={handleSorting}>Sort Array</button>
            <div>Sorted Array: {sortedArray.join(', ')}</div>
        </div>
    );
}