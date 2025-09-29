import { useState, useEffect } from "react";
import CoinChart from "../components/LineChart";
import CoinsTable from "../components/CoinTable";
import { getCoins, getCoinHistory } from "../services/api.js";
import useApi from "../hooks/useApi.js";


export default function Dashboard() {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  
  // Fetch top coins
  const { data: coins, loading: coinsLoading, error: coinsError, execute: fetchCoins } = useApi(getCoins, true);
  
  // Fetch coin history for chart
  const { data: history, loading: historyLoading, execute: fetchHistory } = useApi(getCoinHistory, false);

  // Set the first coin as selected by default
  useEffect(() => {
    if (coins && coins.length > 0 && !selectedCoin) {
        handleCoinSelect(coins[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coins]);

  // Fetch coin history when a coin is selected
  useEffect(() => {
    if (selectedCoin) {
      // Clear existing chart data while loading new coin
      setChartData([]);
      const coinIdForHistory =
        selectedCoin.coingecko_id ||
        selectedCoin.id ||
        (selectedCoin.symbol ? String(selectedCoin.symbol).toLowerCase() : undefined);
      
      console.log('Fetching history for coin:', selectedCoin.name, 'with ID:', coinIdForHistory);
      
      if (coinIdForHistory) {
        // Add a small delay to prevent rapid successive calls
        setTimeout(() => {
          fetchHistory(coinIdForHistory);
        }, 100);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCoin]);

  useEffect(() => {
    if (!history) return;

    console.log('Processing history data:', history);

    let rawPoints = [];
    // Common shapes: {history: [{date, price}]}, [{timestamp, price}], [{date, price}], [[ts, price]]
    if (Array.isArray(history)) {
      rawPoints = history;
    } else if (Array.isArray(history.history)) {
      rawPoints = history.history;
    } else if (Array.isArray(history.data)) {
      rawPoints = history.data;
    }

    console.log('Raw points extracted:', rawPoints);

    if (!Array.isArray(rawPoints) || rawPoints.length === 0) {
      console.log('No valid history data found');
      setChartData([]);
      return;
    }

    const processedData = rawPoints.map((item, index) => {
      // Support tuple [ts, price]
      if (Array.isArray(item) && item.length >= 2) {
        const ts = item[0];
        const pr = item[1];
        return {
          time: new Date(ts || index).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: parseFloat(pr)
        };
      }
      const ts = item.date || item.timestamp || item.time || index;
      const pr = item.price || item.value || item.close || item.p || 0;
      return {
        time: new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: parseFloat(pr)
      };
    }).filter(p => Number.isFinite(p.price));

    console.log('Processed chart data:', processedData);
    setChartData(processedData);
  }, [history]);

  const handleCoinSelect = (coin) => {
    console.log('Coin selected:', coin);
    setSelectedCoin(coin);
  };

  if (coinsLoading && !coins) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (coinsError) {
    return (
      <div className="p-4 m-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline ml-2">{coinsError.message || 'Failed to load cryptocurrency data.'}</span>
        <button 
          onClick={fetchCoins}
          className="ml-4 mt-2 sm:mt-0 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Crypto Dashboard</h1>
        <button 
          onClick={fetchCoins}
          disabled={coinsLoading}
          className="mt-2 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {coinsLoading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center"> */}
      
            {/* Chart Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {selectedCoin ? `${selectedCoin.name} Price History` : 'Select a Coin'}
            </h3>
            {(historyLoading) && (
              <div className="flex items-center text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                Loading chart...
              </div>
            )}
          </div>
          
          {historyLoading ? (
             <div className="h-72 flex items-center justify-center text-gray-500 dark:text-gray-400">
                Loading chart data...
             </div>
          ) : (
            <CoinChart key={selectedCoin?.coingecko_id || selectedCoin?.id || 'none'} data={chartData} />
          )}
          
      </div>

      <CoinsTable 
        coins={coins}
        selectedCoin={selectedCoin}
        handleCoinSelect={handleCoinSelect}
      />


      {/* </div> */}
    </div>
  );
}

