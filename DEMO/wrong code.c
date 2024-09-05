#include <stdio.h>
#include <string.h>

int romanToInt(char *s) {
    int n = strlen(s);
    int tmp[n];
    int result = 0;
    
    for (int i = 0; i < n; i++) {
        if (s[i] == 'V') {
            tmp[i] = 5;
        } else if (s[i] == 'L') {
            tmp[i] = 50;
        } else if (s[i] == 'M') {
            tmp[i] = 500;
        } else if (s[i] == 'D') {
            tmp[i] = 1000;
        } else if (s[i] == 'I') {
            if (i != n - 1 && (s[i + 1] == 'V' || s[i + 1] == 'X')) {
                tmp[i] = -1;
            } else {
                tmp[i] = 1;
            }
        } else if (s[i] == 'X') {
            if (i != n - 1 && (s[i + 1] == 'L' || s[i + 1] == 'C')) {
                tmp[i] = -10;
            } else {
                tmp[i] = 10;
            }
        } else if (s[i] == 'C') {
            if (i != n - 1 && (s[i + 1] == 'D' || s[i + 1] == 'M')) {
                tmp[i] = -100;
            } else {
                tmp[i] = 100;
            }
        }
    }
    
    for (int i = 0; i < n; i++) {
        result += tmp[i];
    }
    
    return result;
}

int main() {
    char s[100]; // Assuming the input won't exceed 100 characters
    // printf("Enter the Roman numeral: ");
    scanf("%s", s);
    printf("%d\n", romanToInt(s));
    return 0;
}
