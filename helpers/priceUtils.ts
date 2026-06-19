const CURRENCY = '\u20ac';

export function getPriceAsNumber(text: string) {
    return Number(
        text?.replace(CURRENCY, '').replace(',', '').trim()
    );
}

export function getPriceWithCurrency(value: number) {
    return String(CURRENCY + value);
}

export function add(...prices: number[]): number {
    const cents = prices.reduce(
        (sum, price) => sum + Math.round(price * 100),
        0
    );

    return Number((cents / 100).toFixed(2));
}