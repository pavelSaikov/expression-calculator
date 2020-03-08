function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    const logicalUnits = [];
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const mathOperators = ['+', '-', '/', '*'];
    const parentheses = ['(', ')'];

    let numberOpeningBrackets = 0;
    let numberClosingBrackets = 0;
    for (let i = 0; i < expr.length; i++) {
        if (expr[i] == '(') numberOpeningBrackets++;
        if (expr[i] == ')') numberClosingBrackets++;
    }

    if (numberClosingBrackets != numberOpeningBrackets) throw new Error('ExpressionError: Brackets must be paired');

    for (let i = 0; i < expr.length; i++) {
        let unit = '';

        if (expr[i] != ' ') {
            while (true) {
                if (unit.length == 0) {
                    unit += expr[i];
                    if (mathOperators.includes(expr[i]) || parentheses.includes(expr[i])) break;
                    i++;
                } else {
                    if (digits.includes(expr[i])) {
                        unit += expr[i];
                        i++;
                    } else {
                        i--;
                        break;
                    }
                }
            }
        }

        if (unit.length != 0) logicalUnits.push(unit);
    }

    const polishExpression = [];
    const operandsStack = [];

    for (let i = 0; i < logicalUnits.length; i++) {
        if (mathOperators.includes(logicalUnits[i]) || parentheses.includes(logicalUnits[i])) {
            switch (logicalUnits[i]) {
                case '+':
                    whereGoPlusOrMinus('+', operandsStack, polishExpression);
                    break;

                case '-':
                    whereGoPlusOrMinus('-', operandsStack, polishExpression);
                    break;

                case '/':
                    whereGoMultiplicationOrDivision('/', operandsStack, polishExpression);
                    break;

                case '*':
                    whereGoMultiplicationOrDivision('*', operandsStack, polishExpression);
                    break;

                case '(':
                    operandsStack.push('(');
                    break;

                case ')':
                    whereGoClosingBracket(operandsStack, polishExpression);
                    break;
            }
        } else {
            polishExpression.push(logicalUnits[i]);
        }

        if (i == logicalUnits.length - 1 && operandsStack.length != 0) {
            while (operandsStack.length != 0) polishExpression.push(operandsStack.pop());
        }
    }

    for (let i = 0; i < polishExpression.length; i++) {
        if (mathOperators.includes(polishExpression[i])) {
            let firstOperand = Number(polishExpression[i - 2]);
            let secondOperand = Number(polishExpression[i - 1]);
            let result = 0;
            switch (polishExpression[i]) {
                case '+':
                    result = firstOperand + secondOperand;
                    break;

                case '-':
                    result = firstOperand - secondOperand;
                    break;

                case '/':
                    if (secondOperand == 0) throw new Error('TypeError: Division by zero.');

                    result = firstOperand / secondOperand;
                    break;

                case '*':
                    result = firstOperand * secondOperand;
                    break;
            }

            polishExpression.splice(i - 2, 3, result.toString());
            i -= 2;
        }

        if (polishExpression.length == 1) break;
    }

    return Number(polishExpression[0]);
}

function whereGoPlusOrMinus(operand, operandsStack, polishExpression) {
    while (true) {
        if (operandsStack.length != 0) {
            let lastOperand = operandsStack.pop();

            if (lastOperand == '(') {
                operandsStack.push(lastOperand);
                operandsStack.push(operand);
                break;
            } else {
                polishExpression.push(lastOperand);
            }
        } else {
            operandsStack.push(operand);
            break;
        }
    }
}

function whereGoMultiplicationOrDivision(operand, operandsStack, polishExpression) {
    while (true) {
        if (operandsStack.length != 0) {
            let lastOperand = operandsStack.pop();

            if (lastOperand == '+' || lastOperand == '-' || lastOperand == '(') {
                operandsStack.push(lastOperand);
                operandsStack.push(operand);
                break;
            } else {
                polishExpression.push(lastOperand);
            }
        } else {
            operandsStack.push(operand);
            break;
        }
    }
}

function whereGoClosingBracket(operandsStack, polishExpression) {
    while (true) {
        let lastOperand = operandsStack.pop();
        if (lastOperand != '(') polishExpression.push(lastOperand);
        else break;
    }
}

module.exports = {
    expressionCalculator,
};
