#include <emscripten.h>
#include <iostream>

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    int adder(int a, int b) {
        return a + b;
    }
}