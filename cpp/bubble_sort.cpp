#include <emscripten.h>
#include <iostream>

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    void bubbleSort(int* arr, int size) {
        for (int i = 0; i < size - 1; ++i) {
            for (int j = 0; j < size - i - 1; ++j) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;

                    // Call the callback function to update the state
                    if (callbackFunc) {
                        callbackFunc(arr, size);
                    }
                }
            }
        }
    }

    EMSCRIPTEN_KEEPALIVE
    int testFunction() {
        return 1;
    }
}