import { useState, useEffect } from 'react';
import WebAssemblyBinary from "../wasm/bubble_sort.wasm";

export default function useWasm() {
    const [wasmModule, setWasmModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadWasm = async () => {
        try {
            const res = await WebAssembly.instantiateStreaming(fetch(WebAssemblyBinary), {
                env: {
                    emscripten_asm_const_int: () => 0,
                    emscripten_resize_heap: () => true,
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