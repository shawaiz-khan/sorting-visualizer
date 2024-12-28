/* Added the comments for better understanding of the code ~ SK */
#include <emscripten.h>
#include <cstring>

extern "C" {
    // Global Variables
    int steps = 0; // Keeps track of the number of steps during the sorting process
    const int MAX_STEPS = 100; // Maximum number of steps allowed
    const int MAX_SIZE = 100; // Maximum array size allowed

    // Global Arrays
    int sortSteps[MAX_STEPS][MAX_SIZE]; // Stores the array at each step of sorting
    int sizes[MAX_STEPS]; // Stores the size of the array at each step
    int swappedIndices[MAX_STEPS][2]; // Stores the indices of swapped elements at each step

    /* Swap Function   
        Swaps two integer values passed by reference. 
    */
    void swap(int& a, int& b) {
        int temp = a;
        a = b;
        b = temp;
    }

    /* getSteps Function
        Returns the total number of steps taken during the sorting process.
        This function is accessible from JavaScript via WebAssembly. 
    */
    EMSCRIPTEN_KEEPALIVE
    int getSteps() {
        return steps;
    }

    /* getStepArray Function
        Copies the array at a specific step into the output array.
    Parameters:
        - output: Pointer to the output array.
        - stepIndex: Index of the desired step. 
    */
    EMSCRIPTEN_KEEPALIVE
    void getStepArray(int* output, int stepIndex) {
        if (stepIndex >= 0 && stepIndex < steps) {
            memcpy(output, sortSteps[stepIndex], sizes[stepIndex] * sizeof(int));
        }
    }

    /* getStepSwappedIndices Function
        Copies the indices of the swapped elements at a specific step into the output array.
    Parameters:
        - output: Pointer to the output array.
        - stepIndex: Index of the desired step. 
    */
    EMSCRIPTEN_KEEPALIVE
    void getStepSwappedIndices(int* output, int stepIndex) {
        if (stepIndex >= 0 && stepIndex < steps) {
            output[0] = swappedIndices[stepIndex][0];
            output[1] = swappedIndices[stepIndex][1];
        }
    }

    /* bubbleSort Function
        Implements the bubble sort algorithm and tracks each step along with the swapped indices.
    Parameters:
        - arr: Pointer to the array to be sorted.
        - size: Size of the array. 
    */
    EMSCRIPTEN_KEEPALIVE
    void bubbleSort(int* arr, int size) {
        steps = 0; // Initialize step counter

        // Record the initial state of the array
        memcpy(sortSteps[steps], arr, size * sizeof(int));
        sizes[steps] = size;
        swappedIndices[steps][0] = -1; // No swaps yet
        swappedIndices[steps][1] = -1;
        steps++;

        // Perform bubble sort
        for (int i = 0; i < size - 1; ++i) {
            for (int j = 0; j < size - i - 1; ++j) {
                if (arr[j] > arr[j + 1]) {
                    // Swap adjacent elements if they are in the wrong order
                    swap(arr[j], arr[j + 1]);

                    // Record the current state of the array
                    memcpy(sortSteps[steps], arr, size * sizeof(int));
                    sizes[steps] = size;
                    swappedIndices[steps][0] = j; // Record swapped indices
                    swappedIndices[steps][1] = j + 1;
                    steps++;

                    // Break if the maximum number of steps is exceeded
                    if (steps >= MAX_STEPS) {
                        break;
                    }
                }
            }
        }
    }
}