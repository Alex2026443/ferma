export const money = (value: number) => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`
export const compactMoney = (value: number) => `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(value / 1_000_000)} млн ₽`
