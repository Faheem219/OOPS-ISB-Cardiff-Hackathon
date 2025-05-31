# Buffer Overflow Example

## Introduction
A buffer overflow occurs when a program writes more data to a buffer than it can hold, overwriting adjacent memory and potentially altering program flow.

## Vulnerable C Code Example
```c
#include <stdio.h>
#include <string.h>

void vulnerable(char *input) {
    char buffer[64];
    strcpy(buffer, input);  // no bounds checking
    printf("Buffer contents: %s\n", buffer);
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Usage: %s <input>\n", argv[0]);
        return 1;
    }
    vulnerable(argv[1]);
    return 0;
}
```

## Exploitation Steps
1. **Understand memory layout**  
   - Identify buffer size (64 bytes) and return address location.
2. **Craft payload**  
   - Overflow buffer with 64 bytes + new return address.
     ```
     [64 bytes padding] + [address of shellcode]
     ```
3. **Inject shellcode**  
   - Place machine code that spawns a shell.
4. **Execute program**  
   ```
   ./vuln $(python -c "print('A'*64 + '\xef\xbe\xad\xde')")
   ```

## Prevention Measures
- **Bounds Checking**  
  - Use `strncpy`, `snprintf`, or safe library functions.
- **Stack Canaries**  
  - Detect overwrites before function return.
- **ASLR (Address Space Layout Randomization)**  
  - Randomize memory addresses.
- **DEP/NX (Data Execution Prevention)**  
  - Mark memory non-executable.
- **Use Safe Languages**  
  - Rust, Go, etc., that enforce memory safety.