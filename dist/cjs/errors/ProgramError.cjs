'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var MetaplexError = require('./MetaplexError.cjs');

class ProgramError extends MetaplexError.MetaplexError {
  constructor(program, input) {
    super({ ...input,
      key: `program.${input.key}`,
      title: `${program.name} > ${input.title}`,
      source: 'program',
      sourceDetails: `${program.name} [${program.address.toBase58()}]`
    });
    this.program = program;
  }

}
class ParsedProgramError extends ProgramError {
  constructor(program, cause) {
    const ofCode = cause.code ? ` of code [${cause.code}]` : '';
    super(program, {
      cause,
      key: 'parsed_program_error',
      title: cause.message,
      problem: `The program [${program.name}] at address [${program.address.toBase58()}] ` + `raised an error${ofCode} that translates to "${cause.message}".`,
      solution: 'Check the error message provided by the program.',
      logs: cause.logs
    });
  }

}
class UnknownProgramError extends ProgramError {
  constructor(program, cause) {
    const ofCode = cause.code ? ` of code [${cause.code}]` : '';
    super(program, {
      cause,
      key: 'unknown_program_error',
      title: 'Unknown Program Error',
      problem: `The program [${program.name}] at address [${program.address.toBase58()}] ` + `raised an error${ofCode} that is not recognized by the programs registered by the SDK.`,
      solution: 'Unfortunately, you will need to check the unparsed ' + 'error below to investigate what went wrong. ' + 'To get more helpful error messages, ensure the program that failed is ' + 'registered by the SDK and provides an "errorResolver" method.',
      logs: cause.logs
    });
  }

}

exports.ParsedProgramError = ParsedProgramError;
exports.ProgramError = ProgramError;
exports.UnknownProgramError = UnknownProgramError;
//# sourceMappingURL=ProgramError.cjs.map
