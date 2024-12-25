#include <emscripten.h>
#include <iostream>

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    void bubbleSort(int* arr, int size, void (*callback)(int*, int)) {
        for (int i = 0; i < size - 1; ++i) {
            for (int j = 0; j < size - i - 1; ++j) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
            callback(arr, size);
        }
    }
}