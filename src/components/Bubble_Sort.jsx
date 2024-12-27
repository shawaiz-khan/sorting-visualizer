import React, { useState } from 'react';
import useWasm from '../hooks/useWasm';

export default function BubbleSortComponent() {
    const { wasmModule, loading, error } = useWasm();
    const [array, setArray] = useState([3, 8, 6, 23, 9, 12, 34, 2]);
    const [currentStepArray, setCurrentStepArray] = useState([]);
    const [steps, setSteps] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const handleSorting = () => {
        if (!wasmModule) return;

        console.log(wasmModule);

        const wasmMemory = new Int32Array(wasmModule.memory.buffer);
        const arraySize = array.length;

        // Allocate memory for the array in WASM
        const arrayPtr = wasmModule.malloc(arraySize * 4);

        // Copy the input array into WASM memory
        for (let i = 0; i < arraySize; i++) {
            wasmMemory[arrayPtr / 4 + i] = array[i];
        }

        // Call the WASM bubble sort function
        wasmModule.bubbleSort(arrayPtr, arraySize);

        // Get the number of steps
        const totalSteps = wasmModule.getSteps();
        setSteps(totalSteps);

        // Initialize the first step's array
        const stepArray = [];
        for (let i = 0; i < arraySize; i++) {
            stepArray.push(wasmMemory[arrayPtr / 4 + i]);
        }
        setCurrentStepArray(stepArray);

        // Free the allocated memory (optional, as JS/WASM integration manages it)
        wasmModule.free(arrayPtr);
    };

    const handleNextStep = () => {
        if (!wasmModule || currentStep >= steps - 1) return;

        const wasmMemory = new Int32Array(wasmModule.memory.buffer);
        const arraySize = array.length;

        const stepArrayPtr = wasmModule.malloc(arraySize * 4);
        wasmModule.getStepArray(stepArrayPtr, currentStep + 1);

        const stepArray = [];
        for (let i = 0; i < arraySize; i++) {
            stepArray.push(wasmMemory[stepArrayPtr / 4 + i]);
        }

        setCurrentStepArray(stepArray);
        setCurrentStep(currentStep + 1);

        wasmModule.free(stepArrayPtr);
    };

    const handlePrevStep = () => {
        if (!wasmModule || currentStep <= 0) return;

        const wasmMemory = new Int32Array(wasmModule.memory.buffer);
        const arraySize = array.length;

        const stepArrayPtr = wasmModule.malloc(arraySize * 4);
        wasmModule.getStepArray(stepArrayPtr, currentStep - 1);

        const stepArray = [];
        for (let i = 0; i < arraySize; i++) {
            stepArray.push(wasmMemory[stepArrayPtr / 4 + i]);
        }

        setCurrentStepArray(stepArray);
        setCurrentStep(currentStep - 1);

        wasmModule.free(stepArrayPtr);
    };

    return (
        <div>
            <h1>Bubble Sort Visualization</h1>
            <div>Initial Array: {array.join(', ')}</div>
            <button onClick={handleSorting}>Start Sorting</button>
            <div>Steps: {steps}</div>
            <div>
                <button onClick={handlePrevStep} disabled={currentStep === 0}>
                    Previous Step
                </button>
                <button onClick={handleNextStep} disabled={currentStep >= steps - 1}>
                    Next Step
                </button>
            </div>
            <div>
                <strong>Current Step ({currentStep}):</strong>{' '}
                {currentStepArray.length > 0 ? currentStepArray.join(', ') : 'N/A'}
            </div>
        </div>
    );
}