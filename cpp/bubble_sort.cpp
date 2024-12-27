#include <emscripten.h>
#include <cstring>

extern "C" {
    int steps = 0;
    const int MAX_STEPS = 100;
    const int MAX_SIZE = 100;
    int sortSteps[MAX_STEPS][MAX_SIZE];
    int sizes[MAX_STEPS];

    void swap(int& a, int& b) {
        int temp = a;
        a = b;
        b = temp;
    }

    EMSCRIPTEN_KEEPALIVE
    int getSteps() {
        return steps;
    }

    EMSCRIPTEN_KEEPALIVE
    void getStepArray(int* output, int stepIndex) {
        if (stepIndex >= 0 && stepIndex < steps) {
            memcpy(output, sortSteps[stepIndex], sizes[stepIndex] * sizeof(int));
        }
    }

    EMSCRIPTEN_KEEPALIVE
    void bubbleSort(int* arr, int size) {
        steps = 0;

        memcpy(sortSteps[steps], arr, size * sizeof(int));
        sizes[steps] = size;
        steps++;

        for (int i = 0; i < size - 1; ++i) {
            for (int j = 0; j < size - i - 1; ++j) {
                if (arr[j] > arr[j + 1]) {
                    swap(arr[j], arr[j + 1]);
                }
            }

            memcpy(sortSteps[steps], arr, size * sizeof(int));
            sizes[steps] = size;
            steps++;

            if (steps >= MAX_STEPS) {
                break;
            }
        }
    }
}