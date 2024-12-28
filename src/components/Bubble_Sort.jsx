import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useWasm from '../hooks/useWasm';

export default function BubbleSortComponent() {
    const { wasmModule, loading, error } = useWasm();
    const array = [15, 3, 42, 7, 27, 19, 8, 31, 4, 22];
    const [currentStepArray, setCurrentStepArray] = useState([]);
    const [steps, setSteps] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [highlightIndices, setHighlightIndices] = useState([]);

    const handleSorting = () => {
        if (!wasmModule) return;

        console.log("Starting Sorting...");

        const wasmMemory = new Int32Array(wasmModule.memory.buffer);
        const arraySize = array.length;

        // Allocate memory in WebAssembly for the array
        const arrayPtr = wasmModule.malloc(arraySize * 4);

        // Copy the input array from JavaScript to the allocated memory
        for (let i = 0; i < arraySize; i++) {
            wasmMemory[arrayPtr / 4 + i] = array[i];
        }

        // Call the bubble sort function in WebAssembly
        wasmModule.bubbleSort(arrayPtr, arraySize);

        // Get the total number of steps taken during the sort process
        const totalSteps = wasmModule.getSteps();
        setSteps(totalSteps);
        console.log(`Total steps for sorting: ${totalSteps}`);

        // Create a new array to store the sorted values at the current step
        const stepArray = [];
        for (let i = 0; i < arraySize; i++) {
            stepArray.push(wasmMemory[arrayPtr / 4 + i]);
        }

        setCurrentStepArray(stepArray);

        // Free the allocated memory for the array after use
        wasmModule.free(arrayPtr);
        setCurrentStep(0);
        setHighlightIndices([]);

        console.log('Sorting completed. Sorted array:', stepArray);
    };

    const handleStepChange = (stepIndex) => {
        console.log(`Changing to step: ${stepIndex}`);

        if (!wasmModule || stepIndex < 0 || stepIndex >= steps) return;

        const wasmMemory = new Int32Array(wasmModule.memory.buffer);
        const arraySize = array.length;

        // Allocate memory for the step array and swapped indices
        const stepArrayPtr = wasmModule.malloc(arraySize * 4);
        const swapIndicesPtr = wasmModule.malloc(8);

        // Retrieve the step array and swapped indices for the given step
        wasmModule.getStepArray(stepArrayPtr, stepIndex);
        wasmModule.getStepSwappedIndices(swapIndicesPtr, stepIndex);

        // Create a new array to hold the data at the specific step
        const stepArray = [];
        for (let i = 0; i < arraySize; i++) {
            stepArray.push(wasmMemory[stepArrayPtr / 4 + i]);
            console.log("Step Array: ", stepArray);
        }

        // Retrieve the swapped indices for the step
        const swapIndices = [
            wasmMemory[swapIndicesPtr / 4],
            wasmMemory[swapIndicesPtr / 4 + 1],
        ];

        console.log(`Step ${stepIndex}:`, stepArray);
        console.log(`Highlighting indices:`, swapIndices);

        setCurrentStepArray(stepArray);
        setHighlightIndices(swapIndices[0] !== -1 ? swapIndices : []);
        setCurrentStep(stepIndex);

        // Free the allocated memory for the step array and swap indices
        wasmModule.free(stepArrayPtr);
        wasmModule.free(swapIndicesPtr);
    };

    const handleNextStep = () => {
        handleStepChange(currentStep + 1);
    };

    const handlePrevStep = () => {
        handleStepChange(currentStep - 1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 flex items-center justify-center">
            <div className="bg-white p-10 rounded-lg shadow-lg text-center w-4/5 max-w-3xl">
                <h1 className="text-4xl font-bold text-gray-800 mb-5">Bubble Sort Visualization</h1>
                <p className="text-lg text-gray-600 mb-5">Initial Array: <span className="font-medium">{array.join(', ')}</span></p>
                <div className="mb-6">
                    <button
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-2 rounded-md transition duration-300"
                        onClick={handleSorting}
                    >
                        Start Sorting
                    </button>
                </div>
                <p className="text-gray-700 font-semibold mb-3">Steps: <span className="font-normal">{steps}</span></p>
                <div className="flex justify-center gap-3 mb-6">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-md disabled:opacity-50 transition duration-300"
                        onClick={handlePrevStep}
                        disabled={currentStep === 0}
                    >
                        Previous Step
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-md disabled:opacity-50 transition duration-300"
                        onClick={handleNextStep}
                        disabled={currentStep >= steps - 1}
                    >
                        Next Step
                    </button>
                </div>
                <strong className="text-gray-700">Current Step ({currentStep}):</strong>
                <div className="flex justify-center gap-3 mt-5">
                    {currentStepArray.length > 0
                        ? currentStepArray.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 1 }}
                                animate={{
                                    scale: highlightIndices.includes(index) ? 1.2 : 1,
                                    backgroundColor: highlightIndices.includes(index)
                                        ? '#fbbf24'
                                        : '#f3f4f6',
                                }}
                                transition={{ duration: 0.3 }}
                                className="px-4 py-2 border rounded-md shadow-md text-gray-800 font-medium"
                            >
                                {item}
                            </motion.div>
                        ))
                        : <p className="text-gray-500">N/A</p>
                    }
                </div>
            </div>
        </div>
    );
}