"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAmount = exports.isNegativeAmount = exports.isPositiveAmount = exports.isZeroAmount = exports.isGreaterThanOrEqualToAmount = exports.isGreaterThanAmount = exports.isLessThanOrEqualToAmount = exports.isLessThanAmount = exports.isEqualToAmount = exports.compareAmounts = exports.divideAmount = exports.multiplyAmount = exports.subtractAmounts = exports.addAmounts = exports.assertSameCurrencies = exports.assertSol = exports.assertCurrency = exports.sameCurrencies = exports.isSol = exports.toBasisPoints = exports.usd = exports.sol = exports.lamports = exports.amount = exports.USD = exports.SOL = void 0;
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const errors_1 = require("../errors");
exports.SOL = {
    symbol: 'SOL',
    decimals: 9,
};
exports.USD = {
    symbol: 'USD',
    decimals: 2,
};
const amount = (basisPoints, currency) => {
    return {
        basisPoints: (0, exports.toBasisPoints)(basisPoints),
        currency,
    };
};
exports.amount = amount;
const lamports = (lamports) => {
    return (0, exports.amount)(lamports, exports.SOL);
};
exports.lamports = lamports;
const sol = (sol) => {
    return (0, exports.lamports)(sol * web3_js_1.LAMPORTS_PER_SOL);
};
exports.sol = sol;
const usd = (usd) => {
    return (0, exports.amount)(usd * 100, exports.USD);
};
exports.usd = usd;
const toBasisPoints = (value) => {
    return new bn_js_1.default(value);
};
exports.toBasisPoints = toBasisPoints;
const isSol = (currencyOrAmount) => {
    return (0, exports.sameCurrencies)(currencyOrAmount, exports.SOL);
};
exports.isSol = isSol;
const sameCurrencies = (left, right) => {
    if ('currency' in left) {
        left = left.currency;
    }
    if ('currency' in right) {
        right = right.currency;
    }
    return (left.symbol === right.symbol &&
        left.decimals === right.decimals &&
        left.namespace === right.namespace);
};
exports.sameCurrencies = sameCurrencies;
const assertCurrency = (actual, expected) => {
    if ('currency' in actual) {
        actual = actual.currency;
    }
    if (!(0, exports.sameCurrencies)(actual, expected)) {
        throw new errors_1.UnexpectedCurrencyError(actual, expected);
    }
};
exports.assertCurrency = assertCurrency;
const assertSol = (actual) => {
    (0, exports.assertCurrency)(actual, exports.SOL);
};
exports.assertSol = assertSol;
const assertSameCurrencies = (left, right, operation) => {
    if ('currency' in left) {
        left = left.currency;
    }
    if ('currency' in right) {
        right = right.currency;
    }
    if (!(0, exports.sameCurrencies)(left, right)) {
        throw new errors_1.CurrencyMismatchError(left, right, operation);
    }
};
exports.assertSameCurrencies = assertSameCurrencies;
const addAmounts = (left, right) => {
    (0, exports.assertSameCurrencies)(left, right, 'add');
    return (0, exports.amount)(left.basisPoints.add(right.basisPoints), left.currency);
};
exports.addAmounts = addAmounts;
const subtractAmounts = (left, right) => {
    (0, exports.assertSameCurrencies)(left, right, 'subtract');
    return (0, exports.amount)(left.basisPoints.sub(right.basisPoints), left.currency);
};
exports.subtractAmounts = subtractAmounts;
const multiplyAmount = (left, multiplier) => {
    return (0, exports.amount)(left.basisPoints.muln(multiplier), left.currency);
};
exports.multiplyAmount = multiplyAmount;
const divideAmount = (left, divisor) => {
    return (0, exports.amount)(left.basisPoints.divn(divisor), left.currency);
};
exports.divideAmount = divideAmount;
const compareAmounts = (left, right) => {
    (0, exports.assertSameCurrencies)(left, right, 'compare');
    return left.basisPoints.cmp(right.basisPoints);
};
exports.compareAmounts = compareAmounts;
const isEqualToAmount = (left, right) => (0, exports.compareAmounts)(left, right) === 0;
exports.isEqualToAmount = isEqualToAmount;
const isLessThanAmount = (left, right) => (0, exports.compareAmounts)(left, right) < 0;
exports.isLessThanAmount = isLessThanAmount;
const isLessThanOrEqualToAmount = (left, right) => (0, exports.compareAmounts)(left, right) <= 0;
exports.isLessThanOrEqualToAmount = isLessThanOrEqualToAmount;
const isGreaterThanAmount = (left, right) => (0, exports.compareAmounts)(left, right) > 0;
exports.isGreaterThanAmount = isGreaterThanAmount;
const isGreaterThanOrEqualToAmount = (left, right) => (0, exports.compareAmounts)(left, right) >= 0;
exports.isGreaterThanOrEqualToAmount = isGreaterThanOrEqualToAmount;
const isZeroAmount = (value) => (0, exports.compareAmounts)(value, (0, exports.amount)(0, value.currency)) === 0;
exports.isZeroAmount = isZeroAmount;
const isPositiveAmount = (value) => (0, exports.compareAmounts)(value, (0, exports.amount)(0, value.currency)) >= 0;
exports.isPositiveAmount = isPositiveAmount;
const isNegativeAmount = (value) => (0, exports.compareAmounts)(value, (0, exports.amount)(0, value.currency)) < 0;
exports.isNegativeAmount = isNegativeAmount;
const formatAmount = (value) => {
    const power = new bn_js_1.default(10).pow(new bn_js_1.default(value.currency.decimals));
    const basisPoints = value.basisPoints;
    const { div, mod } = basisPoints.divmod(power);
    const units = `${div.toString()}.${mod.abs().toString()}`;
    return `${value.currency.symbol} ${units}`;
};
exports.formatAmount = formatAmount;
//# sourceMappingURL=Amount.js.map