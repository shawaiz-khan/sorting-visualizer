import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useWasm from '../hooks/useWasm';

export default function BubbleSortComponent() {
    const { wasmModule, loading, error } = useWasm();
    const [array, setArray] = useState([3, 8, 6, 23, 9, 12, 34, 2]);
    const [currentStepArray, setCurrentStepArray] = useState([]);
    const [steps, setSteps] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [highlightIndices, setHighlightIndices] = useState([]);

    const handleSorting = () => {
        if (!wasmModule) return;

        const wasmMemory = new Int32Array(wasmModule.memory.buffer);
        const arraySize = array.length;

        const arrayPtr = wasmModule.malloc(arraySize * 4);

        for (let i = 0; i < arraySize; i++) {
            wasmMemory[arrayPtr / 4 + i] = array[i];
        }

        wasmModule.bubbleSort(arrayPtr, arraySize);

        const totalSteps = wasmModule.getSteps();
        setSteps(totalSteps);

        const stepArray = [];
        for (let i = 0; i < arraySize; i++) {
            stepArray.push(wasmMemory[arrayPtr / 4 + i]);
        }
        setCurrentStepArray(stepArray);

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

        setHighlightIndices([currentStep % arraySize, (currentStep + 1) % arraySize]);

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

        setHighlightIndices([(currentStep - 1) % arraySize, currentStep % arraySize]);

        wasmModule.free(stepArrayPtr);
    };

    return (
        <div className='min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center'>
            <motion.div
                className='bg-white p-10 rounded-lg shadow-lg text-center w-4/5 max-w-3xl'
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className='text-4xl font-bold text-gray-800 mb-5'>Bubble Sort Visualization</h1>
                <p className='text-lg text-gray-600 mb-5'>Initial Array: <span className='font-medium'>{array.join(', ')}</span></p>
                <div className='mb-6'>
                    <button
                        className='bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-2 rounded-md transition duration-300'
                        onClick={handleSorting}
                    >
                        Start Sorting
                    </button>
                </div>
                <p className='text-gray-700 font-semibold mb-3'>Steps: <span className='font-normal'>{steps - 1}</span></p>
                <div className='flex justify-center gap-3 mb-6'>
                    <button
                        className='bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-md disabled:opacity-50 transition duration-300'
                        onClick={handlePrevStep}
                        disabled={currentStep === 0}
                    >
                        Previous Step
                    </button>
                    <button
                        className='bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-md disabled:opacity-50 transition duration-300'
                        onClick={handleNextStep}
                        disabled={currentStep >= steps - 1}
                    >
                        Next Step
                    </button>
                </div>
                <strong className='text-gray-700'>Current Step ({currentStep}):</strong>
                <div className='flex justify-center gap-3 mt-5'>
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
                                className='px-4 py-2 border rounded-md shadow-md text-gray-800 font-medium'
                            >
                                {item}
                            </motion.div>
                        ))
                        : <p className='text-gray-500'>N/A</p>}
                </div>
            </motion.div>
        </div>
    );
}