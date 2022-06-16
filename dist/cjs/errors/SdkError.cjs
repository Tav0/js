'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var MetaplexError = require('./MetaplexError.cjs');

class SdkError extends MetaplexError.MetaplexError {
  constructor(input) {
    super({ ...input,
      key: `sdk.${input.key}`,
      source: 'sdk'
    });
  }

}
class OperationHandlerMissingError extends SdkError {
  constructor(operationKey, cause) {
    super({
      cause,
      key: 'operation_handler_missing',
      title: 'Operation Handler Missing',
      problem: `No operation handler was registered for the [${operationKey}] operation.`,
      solution: 'Did you forget to register it? You may do this by using: ' + '"metaplex.register(operation, operationHandler)".'
    });
  }

}
class DriverNotProvidedError extends SdkError {
  constructor(driver, cause) {
    super({
      cause,
      key: 'driver_not_provided',
      title: 'Driver Not Provided',
      problem: `The SDK tried to access the driver [${driver}] but was not provided.`,
      solution: 'Make sure the driver is registered by using the "setDriver(myDriver)" method.'
    });
  }

}
class UnexpectedCurrencyError extends SdkError {
  constructor(actual, expected, cause) {
    super({
      cause,
      key: 'unexpected_currency',
      title: 'Unexpected Currency',
      problem: `Expected currency [${expected}] but got [${actual}].`,
      solution: 'Ensure the provided Amount or Currency is of the expected type.'
    });
    this.actual = actual;
    this.expected = expected;
  }

}
class CurrencyMismatchError extends SdkError {
  constructor(left, right, operation, cause) {
    const wrappedOperation = operation ? ` [${operation}]` : '';
    super({
      cause,
      key: 'currency_mismatch',
      title: 'Currency Mismatch',
      problem: `The SDK tried to execute an operation${wrappedOperation} on two different currencies: ` + `${left.symbol} and ${right.symbol}.`,
      solution: 'Provide both amounts in the same currency to perform this operation.'
    });
    this.left = left;
    this.right = right;
    this.operation = operation;
  }

}
class InvalidJsonVariableError extends SdkError {
  constructor(cause) {
    super({
      cause,
      key: 'invalid_json_variable',
      title: 'Invalid JSON Variable',
      problem: 'The provided JSON variable could not be parsed into a string.',
      solution: 'Ensure the variable can be parsed as a JSON string using "JSON.stringify(myVariable)".'
    });
  }

}
class InvalidJsonStringError extends SdkError {
  constructor(cause) {
    super({
      cause,
      key: 'invalid_json_string',
      title: 'Invalid JSON String',
      problem: 'The provided string could not be parsed into a JSON variable.',
      solution: 'Ensure the provided string uses a valid JSON syntax.'
    });
  }

}
class OperationUnauthorizedForGuestsError extends SdkError {
  constructor(operation, cause) {
    super({
      cause,
      key: 'operation_unauthorized_for_guests',
      title: 'Operation Unauthorized For Guests',
      problem: `Trying to access the [${operation}] operation as a guest.`,
      solution: 'Ensure your wallet is connected using the identity driver. ' + 'For instance, by using "metaplex.use(walletAdapterIdentity(wallet))" or ' + '"metaplex.use(keypairIdentity(keypair))".'
    });
  }

}
class UninitializedWalletAdapterError extends SdkError {
  constructor(cause) {
    super({
      cause,
      key: 'uninitialized_wallet_adapter',
      title: 'Uninitialized Wallet Adapter',
      problem: 'The current wallet adapter is not initialized.',
      solution: 'You likely have selected a wallet adapter but forgot to initialize it. ' + 'You may do this by running the following asynchronous method: "walletAdater.connect();".'
    });
  }

}
class OperationNotSupportedByWalletAdapterError extends SdkError {
  constructor(operation, cause) {
    super({
      cause,
      key: 'operation_not_supported_by_wallet_adapter',
      title: 'Operation Not Supported By Wallet Adapter',
      problem: `The current wallet adapter does not support the following operation: [${operation}].`,
      solution: 'Ensure your wallet is connected using a compatible wallet adapter.'
    });
  }

}
class TaskIsAlreadyRunningError extends SdkError {
  constructor(cause) {
    super({
      cause,
      key: 'task_is_already_running',
      title: 'Task Is Already Running',
      problem: "Trying to re-run a task that hasn't completed yet.",
      solution: 'Ensure the task has completed using "await" before trying to run it again.'
    });
  }

}
class AssetNotFoundError extends SdkError {
  constructor(location, cause) {
    super({
      cause,
      key: 'asset_not_found',
      title: 'Asset Not Found',
      problem: `The asset at [${location}] could not be found.`,
      solution: 'Ensure the asset exists at the given path or URI.'
    });
  }

}
class AccountNotFoundError extends SdkError {
  constructor(address, accountType, solution, cause) {
    super({
      cause,
      key: 'account_not_found',
      title: 'Account Not Found',
      problem: (accountType ? `The account of type [${accountType}] was not found` : 'No account was found') + ` at the provided address [${address.toBase58()}].`,
      solution: solution !== null && solution !== void 0 ? solution : 'Ensure the provided address is correct and that an account exists at this address.'
    });
  }

}
class UnexpectedAccountError extends SdkError {
  constructor(address, accountType, cause) {
    super({
      cause,
      key: 'unexpected_account',
      title: 'Unexpected Account',
      problem: `The account at the provided address [${address.toBase58()}] ` + `is not of the expected type [${accountType}].`,
      solution: `Ensure the provided address is correct and that it holds an account of type [${accountType}].`
    });
  }

}
class ProgramNotRecognizedError extends SdkError {
  constructor(nameOrAddress, cluster, cause) {
    const isName = typeof nameOrAddress === 'string';
    const toString = isName ? nameOrAddress : nameOrAddress.toBase58();
    super({
      cause,
      key: 'program_not_recognized',
      title: 'Program Not Recognized',
      problem: `The provided program ${isName ? 'name' : 'address'} [${toString}] ` + `is not recognized in the [${cluster}] cluster.`,
      solution: 'Did you forget to register this program? ' + 'If so, you may use "metaplex.programs().register(myProgram)" to fix this.'
    });
    this.nameOrAddress = nameOrAddress;
    this.cluster = cluster;
  }

}
class MissingGpaBuilderError extends SdkError {
  constructor(program, cause) {
    super({
      cause,
      key: 'missing_gpa_builder',
      title: 'Missing "getProgramAccount" Builder',
      problem: `The program [${program.name}] does not have a registered "getProgramAccount" builder.`,
      solution: 'When registering a program, make sure you provide a "gpaResolver" ' + 'before trying to access its "getProgramAccount" builder.'
    });
    this.program = program;
  }

}
class NotYetImplementedError extends SdkError {
  constructor(cause) {
    super({
      cause,
      key: 'not_yet_implemented',
      title: 'Not Yet Implemented',
      problem: 'This feature is not yet implemented.',
      solution: 'Please check back later.'
    });
  }

}
class UnreachableCaseError extends SdkError {
  constructor(value, cause) {
    super({
      cause,
      key: 'unreachable_case',
      title: `The Case '${value}' in a Switch or If Statement went Unhandled.`,
      problem: 'The developer is not handling that case yet or is missing a `break` or `return` statement.',
      solution: 'Check your inputs or file an issue to have all cases handled properly.'
    });
  }

}

exports.AccountNotFoundError = AccountNotFoundError;
exports.AssetNotFoundError = AssetNotFoundError;
exports.CurrencyMismatchError = CurrencyMismatchError;
exports.DriverNotProvidedError = DriverNotProvidedError;
exports.InvalidJsonStringError = InvalidJsonStringError;
exports.InvalidJsonVariableError = InvalidJsonVariableError;
exports.MissingGpaBuilderError = MissingGpaBuilderError;
exports.NotYetImplementedError = NotYetImplementedError;
exports.OperationHandlerMissingError = OperationHandlerMissingError;
exports.OperationNotSupportedByWalletAdapterError = OperationNotSupportedByWalletAdapterError;
exports.OperationUnauthorizedForGuestsError = OperationUnauthorizedForGuestsError;
exports.ProgramNotRecognizedError = ProgramNotRecognizedError;
exports.SdkError = SdkError;
exports.TaskIsAlreadyRunningError = TaskIsAlreadyRunningError;
exports.UnexpectedAccountError = UnexpectedAccountError;
exports.UnexpectedCurrencyError = UnexpectedCurrencyError;
exports.UninitializedWalletAdapterError = UninitializedWalletAdapterError;
exports.UnreachableCaseError = UnreachableCaseError;
//# sourceMappingURL=SdkError.cjs.map
