MODULE_NAME=bubble_sort
OUTPUT_JS=src/wasm/bubble_sort.js
OUTPUT_WASM=src/wasm/bubble_sort.wasm

emcc cpp/${MODULE_NAME}.cpp \
    -o ${OUTPUT_JS} \
    -s EXPORT_ES6=1 \
    -s EXPORT_NAME="$MODULE_NAME" \
    -s ENVIRONMENT="web"