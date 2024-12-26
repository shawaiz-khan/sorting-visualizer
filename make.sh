MODULE_NAME=bubble_sort
OUTPUT_JS=src/wasm/bubble_sort.js
OUTPUT_WASM=src/wasm/bubble_sort.wasm

emcc cpp/${MODULE_NAME}.cpp \
    -o ${OUTPUT_JS} \
    -s NO_EXIT_RUNTIME=1 \
    -s "EXPORTED_RUNTIME_METHODS=['ccall']" \
    -s "EXPORTED_FUNCTIONS=['_free','_malloc', '_bubbleSort']" \
    -s EXPORT_ES6=1 \
    -s EXPORT_NAME="$MODULE_NAME" \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s ENVIRONMENT="web"