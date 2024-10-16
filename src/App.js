import React, { useEffect, useState } from "react";
import Chart from "./components/Chart";
import { useStateQuery } from "react-state-query";
import Buttons from "./components/Buttons";
import Transactions from "./components/Transactions";
import axios from "axios";
import "./App.css";
import PdfModal from './components/PdfModal';
import LnModal from './components/LNmodal';
import Bio from './components/Bio'
import { getBalance, getInfo, getTrans } from './components/lnd-webln';

function App() {
  // useState lets us store/update/pass data from inside of this component and also refresh the component when the data changes
  // Though this data will be lost on a refresh since we dont have a database
  const [price, setPrice] = useState(null);
  const [balance, setBalance] = useState(null);
  const [info, setInfo] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nameKey, setNameKey] = useStateQuery("nameKey", localStorage.getItem("nameKey") || "");
  const [lnurlKey, setLnurlKey] = useStateQuery("lnurlKey", localStorage.getItem("lnurlKey") || "");
  const [showTitleScreen, setShowTitleScreen] = useStateQuery("showTitleScreen", localStorage.getItem("showTitleScreen") === "true" || !localStorage.getItem("showTitleScreen"));
  const [modalState, setModalState] = useState({ type: "", open: false });
  
  const handleLogout = () => {
    setNameKey("");
    setLnurlKey("");
    setShowTitleScreen(true);
    localStorage.setItem("showTitleScreen", "true");
    localStorage.removeItem("apiKey");
    localStorage.removeItem("nameKey");
    localStorage.removeItem("urlKey");
    localStorage.removeItem("lnurlKey");
  };
  

  const getPrice = () => {
    axios
      .get("https://api.coinbase.com/v2/prices/BTC-USD/spot")
      .then((res) => {
        const formattedPrice = Number(res.data.data.amount).toFixed(4)
        setPrice(formattedPrice);
        updateChartData(formattedPrice);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getWalletBalance = async () => {
    const balanceResult = await getBalance();
    if (balanceResult) {
      console.log('Balance fetched successfully', balanceResult);
      setBalance(balanceResult?.balance);
    } else {
      console.error('Failed to fetch balance');
      setBalance(0); 
    }
  };

  const getName = async () => {
    const infoResult = await getInfo();
    if (infoResult) {
      console.log('Info fetched successfully', infoResult);
      setInfo(infoResult?.info);
    } else {
      console.error('Failed to fetch info');
      setInfo(0); 
    }
  };

  const getTransactions = async () => {
    try {
        const transactions = await getTrans();
        console.log('Fetched transactions:', transactions);

        if (transactions && Array.isArray(transactions.invoices)) {
            setTransactions(transactions.invoices);
        } else {
            console.error('Expected an array but got:', transactions);
            setTransactions([]);
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
        setTransactions([]);
    }
};


  const updateChartData = (currentPrice) => {
    const timestamp = Date.now();
    // We are able to grab the previous state to look at it and do logic before adding new data to it
    setChartData((prevState) => {
      // If we have no previous state, create a new array with the new price data
      if (!prevState)
        return [
          {
            x: timestamp,
            y: Number(currentPrice),
          },
        ];
      // If the timestamp or price has not changed, we dont want to add a new point
      if (
        prevState[prevState.length - 1].x === timestamp ||
        prevState[prevState.length - 1].y === Number(currentPrice)
      )
        return prevState;
      // If we have previous state than keep it and add the new price data to the end of the array
      return [
        // Here we use the "spread operator" to copy the previous state
        ...prevState,
        {
          x: timestamp,
          y: Number(currentPrice),
        },
      ];
    });
  };

  // useEffect is a 'hook' or special function that will run code based on a trigger
  // The brackets hold the trigger that determines when the code inside of useEffect will run
  // Since it is empty [] that means this code will run once on page load
  useEffect(() => {
      getPrice();
      getWalletBalance();
      getTransactions();
      getName();
  }, []);

  useEffect(() => {
    localStorage.setItem("nameKey", nameKey);
    localStorage.setItem("lnurlKey", lnurlKey);
  }, [nameKey, lnurlKey]);


  useEffect(() => {
    const priceInterval = setInterval(() => {
      getPrice();
    }, 1000);

      const timeInterval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
  
    const walletAndTransactionsInterval = setInterval(() => {
      getWalletBalance();
      getTransactions();
    }, 5000);
  
    return () => {
      clearInterval(priceInterval);
      clearInterval(walletAndTransactionsInterval);
      clearInterval(timeInterval);
    };
  }, []);
  
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playMP3 = () => {
    if (!isPlaying) {
      const newAudio = new Audio("/80s-alarm-clock-sound.mp3");
      newAudio.volume = 0.1;
      newAudio.loop = true;
      newAudio.play();
      setAudio(newAudio);
      setIsPlaying(true);
    }
  };
  
  const stopMP3 = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    }
  };  

const playMP4 = () => {
  if (!isPlaying) {
    const newAudio = new Audio("/oink-40664.mp3");
    newAudio.volume = 0.1;
    newAudio.loop = true;
    newAudio.play();
    setAudio(newAudio);
    setIsPlaying(true);
  }
};

const stopMP4 = () => {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  }
};

  const playMP7 = () => {
    const audio = new Audio("/pg10.mp3");
    audio.play();
  };

  const handleSubmit = () => {
    if (nameKey) {
      setShowTitleScreen(false);
    }
  };

  return (
    <div className="App" id="everything">
      {showTitleScreen ? (
        <div className="title-screen">
          <div className="title">Bitcoin Piggy Bank</div>
          <div>
            <input
              className='input'
              type="text"
              placeholder="Enter name"
              value={nameKey}
              onChange={(e) => setNameKey(e.target.value)}
            />
            <input
              className='input'
              type="text"
              placeholder="Optional - include your lnurl"
              value={lnurlKey}
              onChange={(e) => setLnurlKey(e.target.value)}
            />
            <button className="startButton" onClick={handleSubmit}>Start</button>
          </div>
        </div>
      ) : (
      <div className="pigpic" id="thisisit">
        <h1>
          {nameKey}'s Piggy Bank
        </h1>
        <h2 onMouseEnter={playMP3} onMouseLeave={stopMP3} >
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </h2>
        <div className="row">
        <div className="balance-card">
          <p style={{ fontSize: '40px', fontStyle: '#2b1603' }} onMouseEnter={playMP4} onMouseLeave={stopMP4} >{balance}</p>
          <p style={{ fontSize: '35px', fontStyle: '#2b1603' }} onMouseEnter={playMP4} onMouseLeave={stopMP4} >sats</p>
        </div>
        <Buttons/>
        </div>
        <div className="hungry">
          <img src={process.env.PUBLIC_URL + "/hungry.png"} alt="" style={{ width: "120px", opacity:.7, cursor: "pointer" }} onClick={handleLogout} title="Go outside and play! (logout)"/>
        </div>
        <div className="bookgo">
          <Bio />
          <PdfModal />
          <LnModal lnurlKey={lnurlKey} />
          <div className="full" onClick={() => {
            playMP7();
            if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen()
                .catch((err) => {
                  console.error("Error attempting to enable full screen:", err);
                  document.getElementById("everything").classList.add("fullscreen-mode");
                });
              }
            }}>
            World Atlas
          </div>
        </div>
        <div className="row">
          <div className="row-item">
            <Transactions transactions={transactions} />
          </div>
        </div>
      </div>
    )}
    </div>
  );
}

export default App;
