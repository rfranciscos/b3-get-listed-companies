"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommand = () => {
    const rawArgv = process.argv.slice(2).filter(a => (a || '').trim());
    let argv = [];
    rawArgv.forEach(rawArg => {
        if (!rawArg.startsWith('-'))
            argv.push(rawArg);
        else if (rawArg.split('=').length === 0)
            argv.push(rawArg);
        else {
            let argParts = rawArg.split('=');
            let flag = argParts.shift();
            if (flag)
                argv.push(flag.trim());
            let firstValuePart = argParts.shift();
            if (firstValuePart) {
                firstValuePart = firstValuePart.trim();
                argParts.unshift(firstValuePart);
            }
            argv.push(argParts.join('='));
        }
    });
    argv = argv.filter(a => a);
    let args = [];
    let flags = {};
    let lastWasFlag = false;
    let lastFlag = '';
    for (let index = 0; index < argv.length; index++) {
        if (argv[index].startsWith('-')) {
            lastWasFlag = true;
            lastFlag = argv[index];
            if (flags[argv[index]] === undefined) {
                flags[argv[index]] = true;
            }
        }
        else if (lastWasFlag && argv[index] === '=') {
            // não faz nada
        }
        else if (lastWasFlag) {
            lastWasFlag = false;
            if (argv[index] === "true") {
                flags[lastFlag] = true;
            }
            else if (argv[index] === "false") {
                flags[lastFlag] = false;
            }
            else {
                flags[lastFlag] = argv[index];
            }
        }
        else {
            lastWasFlag = false;
            args.push(argv[index]);
        }
    }
    const task = args.shift();
    return {
        task: task,
        args: args,
        flags: flags
    };
};
exports.printHelp = (description, usage, variables, flags, example) => {
    if (description) {
        console.log(description);
        console.log();
    }
    if (usage) {
        console.log(`usage:`);
        let usageToPrint = usage.trim();
        console.log();
        if (usageToPrint.startsWith('$ ')) {
            console.log(`  ${usageToPrint}`);
        }
        else {
            console.log(`  $ ${usageToPrint}`);
        }
        console.log();
    }
    const hasVariables = variables && Object.keys(variables).length > 0;
    if (hasVariables) {
        console.log('variables:');
        console.log();
        Object.keys(variables).forEach(variable => {
            console.log(`  ${variable}: ${variables[variable]}`);
        });
        console.log();
    }
    const hasFlags = flags && Object.keys(flags).length > 0;
    if (hasFlags) {
        console.log('options:');
        console.log();
        Object.keys(flags).forEach(flag => {
            console.log(`  ${flag}: ${flags[flag]}`);
        });
        console.log();
    }
    if (example) {
        const lines = example.trim().split('\n');
        console.log(`example:`);
        console.log();
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine === '') {
                console.log();
            }
            else if (trimmedLine.startsWith('$ ')) {
                console.log(`  ${trimmedLine}`);
            }
            else {
                console.log(`  $ ${trimmedLine}`);
            }
        });
        console.log();
    }
};
