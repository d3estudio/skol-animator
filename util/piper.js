#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const program = require('commander')
    .version('0.0.1')
    .option('-s <n>', 'Speed to pipe the input file to the output. Defaults to 100ms', (n) => parseInt(n), 100)
    .arguments('<from> <to>')
    .action((from, to) => {
        process.from = from;
        process.to = to;
    })
    .parse(process.argv);
const buffer = [];

console.log(`Piper: Attempting to pipe from ${process.from} to ${process.to} using an interval of ${program.S}ms`);
console.log(`Piper: Reading ${process.from}`);

const reader = readline.createInterface({
  input: fs.createReadStream(process.from)
});

reader
    .on('line', (line) => {
        buffer.push(line);
    })
    .on('close', () => {
        console.log(`Piper: Piping to ${process.to}`);
        const writeToFile = () => {
            setTimeout(() => {
                var line = buffer.shift();
                if(line !== undefined) {
                    fs.appendFile(process.to, `${line}\n`, () => {
                        writeToFile();
                    });
                } else {
                    console.log(`Piper: Done.`);
                    process.exit(0);
                }
            }, program.S);
        }
        writeToFile();
    });
