#include <emscripten.h>
#include <cstring>

extern "C" {
    int steps = 0;
    const int MAX_STEPS = 100;
    const int MAX_SIZE = 100;

    int sortSteps[MAX_STEPS][MAX_SIZE];
    int sizes[MAX_STEPS];
    int swappedIndices[MAX_STEPS][2];

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
    void getStepSwappedIndices(int* output, int stepIndex) {
        if (stepIndex >= 0 && stepIndex < steps) {
            output[0] = swappedIndices[stepIndex][0];
            output[1] = swappedIndices[stepIndex][1];
        }
    }

    EMSCRIPTEN_KEEPALIVE
    void bubbleSort(int* arr, int size) {
        steps = 0;

        memcpy(sortSteps[steps], arr, size * sizeof(int));
        sizes[steps] = size;
        swappedIndices[steps][0] = -1; // No swap in the initial state
        swappedIndices[steps][1] = -1;
        steps++;

        for (int i = 0; i < size - 1; ++i) {
            for (int j = 0; j < size - i - 1; ++j) {
                if (arr[j] > arr[j + 1]) {
                    swap(arr[j], arr[j + 1]);

                    memcpy(sortSteps[steps], arr, size * sizeof(int));
                    sizes[steps] = size;
                    swappedIndices[steps][0] = j;     // Index of first swapped element
                    swappedIndices[steps][1] = j + 1; // Index of second swapped element
                    steps++;

                    if (steps >= MAX_STEPS) {
                        break;
                    }
                }
            }
        }
    }
}