import { useState, useEffect } from 'react';
import WebAssemblyBinary from "../wasm/bubble_sort.wasm";

export default function useWasm() {
    // State to store the WebAssembly module, loading status, and any errors
    const [wasmModule, setWasmModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to load the WebAssembly module and handle memory setup
    const loadWasm = async () => {
        try {
            // Create a memory space for the WebAssembly module (256 pages of memory, each page is 64KB)
            const memory = new WebAssembly.Memory({ initial: 256, maximum: 256 });

            // Fetch and instantiate the WASM file, providing memory and table for the module to use
            const res = await WebAssembly.instantiateStreaming(fetch(WebAssemblyBinary), {
                env: {
                    // Attach the memory to the WebAssembly module
                    memory,
                    // Create an empty table (this is used for function pointers in WebAssembly)
                    table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' }),
                    // Define memory base and table base (these are usually fixed addresses for memory management)
                    __memory_base: 0,
                    __table_base: 0,
                    // Function for copying memory from one location to another (needed for WebAssembly operations)
                    _emscripten_memcpy_js: (dest, src, num) => {
                        const memoryBuffer = new Uint8Array(memory.buffer);
                        // Copy `num` bytes from source to destination
                        memoryBuffer.set(memoryBuffer.subarray(src, src + num), dest);
                        return dest;
                    },
                    // This function would be called to resize the heap if needed, but it's not implemented here
                    emscripten_resize_heap: (requestedSize) => {
                        console.warn(`Heap resize requested: ${requestedSize}. Not implemented.`);
                        return false; // Do nothing
                    },
                },
            });

            // Check the Result
            console.log(res.instance.exports);

            // Set the WASM module instance, which gives access to all the exports from the WASM file
            setWasmModule(res.instance.exports);
        } catch (err) {
            console.error("Failed to load WASM module:", err);
            setError(err); // Set error if loading fails
        } finally {
            setLoading(false); // Set loading to false once the process is finished
        }
    };

    // Run the loadWasm function when the component first mounts (runs once)
    useEffect(() => {
        loadWasm();
    }, []);

    // Return the WASM module, loading status, and any errors to be used in the component
    return { wasmModule, loading, error };
}