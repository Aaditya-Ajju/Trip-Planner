import { useState, useEffect } from 'react'
import { ArrowUpDown, TrendingUp, DollarSign } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [exchangeRate, setExchangeRate] = useState(null)
  const [convertedAmount, setConvertedAmount] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currencies, setCurrencies] = useState([])

  const popularCurrencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' }
  ]

  useEffect(() => {
    setCurrencies(popularCurrencies)
    fetchExchangeRate()
  }, [fromCurrency, toCurrency])

  useEffect(() => {
    if (exchangeRate && amount) {
      setConvertedAmount((amount * exchangeRate).toFixed(2))
    }
  }, [amount, exchangeRate])

  const fetchExchangeRate = async () => {
    if (fromCurrency === toCurrency) {
      setExchangeRate(1)
      return
    }

    setLoading(true)
    try {
      // Using a free API for exchange rates
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      )
      const data = await response.json()
      setExchangeRate(data.rates[toCurrency])
    } catch (error) {
      console.error('Error fetching exchange rate:', error)
      // Fallback to mock data for demo
      setExchangeRate(1.2)
    } finally {
      setLoading(false)
    }
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const formatCurrency = (value, currencyCode) => {
    const currency = currencies.find(c => c.code === currencyCode)
    return `${currency?.symbol || ''}${value}`
  }

  return (
    <div className="currency-card">
      <div className="flex items-center space-x-2 mb-6">
        <DollarSign className="h-6 w-6 text-green-400" />
        <h3 className="text-xl font-bold text-white">Currency Converter</h3>
      </div>

      <div className="space-y-6">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="currency-input w-full"
            placeholder="Enter amount"
            min="0"
            step="0.01"
          />
        </div>

        {/* From Currency */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            From
          </label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="currency-select w-full"
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapCurrencies}
            className="p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 hover:scale-110"
          >
            <ArrowUpDown className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* To Currency */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            To
          </label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="currency-select w-full"
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </option>
            ))}
          </select>
        </div>

        {/* Result */}
        <div className="bg-white bg-opacity-10 rounded-16 p-4 text-center">
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <div>
              <div className="text-2xl font-bold text-white mb-2">
                {formatCurrency(convertedAmount || '0.00', toCurrency)}
              </div>
              {exchangeRate && (
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-300">
                  <TrendingUp className="h-4 w-4" />
                  <span>
                    1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Convert Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {[100, 500, 1000].map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => setAmount(quickAmount)}
              className="py-2 px-3 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 text-white text-sm font-medium transition-all duration-300"
            >
              {quickAmount}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CurrencyConverter