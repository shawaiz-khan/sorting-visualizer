import { useState, useEffect } from 'react';
import WebAssemblyBinary from "../wasm/bubble_sort.wasm";

export default function useWasm() {
    const [wasmModule, setWasmModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadWasm = async () => {
        try {
            const memory = new WebAssembly.Memory({ initial: 256, maximum: 256 });
            const res = await WebAssembly.instantiateStreaming(fetch(WebAssemblyBinary), {
                env: {
                    memory,
                    table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' }),
                    __memory_base: 0,
                    __table_base: 0,
                    _emscripten_memcpy_js: (dest, src, num) => {
                        const memoryBuffer = new Uint8Array(memory.buffer);
                        memoryBuffer.set(memoryBuffer.subarray(src, src + num), dest);
                        return dest;
                    },
                    emscripten_resize_heap: (requestedSize) => {
                        console.warn(`Heap resize requested: ${requestedSize}. Not implemented.`);
                        return false;
                    },
                },
            });
            setWasmModule(res.instance.exports);
        } catch (err) {
            console.error("Failed to load WASM module:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWasm();
    }, []);

    return { wasmModule, loading, error };
}