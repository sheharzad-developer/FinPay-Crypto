import axios from 'axios'

export async function fetchCoinMarketData(ids = 'bitcoin,ethereum,tether') {
  const url = `https://api.coingecko.com/api/v3/coins/markets`
  const params = {
    vs_currency: 'usd',
    ids,
    sparkline: true,
    price_change_percentage: '7d',
  }
  const res = await axios.get(url, { params })
  const mapped = {}
  res.data.forEach(item => {
    mapped[item.id] = item
  })
  return mapped
}