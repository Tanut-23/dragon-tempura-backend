import { useState, useEffect, useRef } from "react";
import RemainingBlock from "../components/RemainingBlock";
import ButtonSubmit from "../components/ButtonSubmit";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  ClockIcon,
  ChartIcon,
  PersonIcon,
  DollarIcon,
  HistoryIcon,
} from "../components/Icons";
import { io } from "socket.io-client";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import axios from "axios";
import baseURL from "../../service/api";

export default function AuctionPage() {
  const { auctionId } = useParams();
  const [timeLeft, setTimeLeft] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const [bid, setBid] = useState("");
  const [historyBid, setHistoryBid] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [auctionData, setAuctionData] = useState(null);
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const { cartItems, setCartItems } = useCart();
  const [isInCartDB, setIsInCartDB] = useState(false);

  useEffect(() => {
    if (!auctionData) return;
    const updateTimeLeft = () => {
      const now = new Date();
      const end = new Date(auctionData.auction.endDate);
      const diff = end - now;
      setTimeLeft(Math.max(0, diff));
      setIsAuctionEnded(diff <= 0);
    };

    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [auctionData]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/product/${auctionId}`);
        setAuctionData(res.data?.product ?? null);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [auctionId]);

  const socket = useRef();
  useEffect(() => {
    socket.current = io(`${baseURL}`);
    return () => socket.current.disconnect();
  }, []);

  // ...existing code...
  useEffect(() => {
    const fetchBidHistory = async () => {
      try {
        console.log("auctionId param:", auctionId);
        const res = await fetch(`${baseURL}/api/bids/${auctionId}`);
        const data = await res.json();
        console.log("bid history from API:", data); // <--- ดูตรงนี้
        const formatted = data.map((b) => ({
          ...b,
          time: new Date(b.createdAt),
          firstName: b.user?.firstName || "Unknown",
          lastName: b.user?.lastName || "",
          amount: b.amount,
        }));
        setHistoryBid(formatted);
      } catch (error) {
        console.error("Error fetching bid history:", error);
      }
    };

    fetchBidHistory();

    socket.current?.on("newBid", fetchBidHistory);
    return () => socket.current?.off("newBid", fetchBidHistory);
  }, [auctionId]);
  // ...existing code...

  const bidCurrent = Math.max(...historyBid.map((b) => b.amount), 0);
  const bidButton = (event) => {
    event.preventDefault();
    const bidUser = Number(bid);

    if (bidUser <= bidCurrent) {
      setErrorMessage(
        `Bid price must be greater than $${bidCurrent.toLocaleString()}`
      );
      return;
    }

    const magicNumber = 999999999999999;
    if (bidUser > magicNumber) {
      setErrorMessage(`Bid price must be lower than one quadrillion.`);
      return;
    }

    // const secondMagicNumber = bidCurrent * 10;
    // if (bidUser  > secondMagicNumber) {
    //   setErrorMessage(
    //     `Bid price cannot exceed $${secondMagicNumber.toLocaleString()} (10 times the current price)`
    //   );
    //   return;
    // }

    const productId = auctionId; // id จาก useParams()
    const userId = user?._id; // user._id จาก useAuth()
    const amount = bidUser;

    if (!productId || !userId) {
      setErrorMessage("Cannot place bid: missing product or user info.");
      return;
    }

    socket.current.emit("placeBid", { productId, userId, amount });
    setBid("");
    setErrorMessage("");
  };

  const noDecimal = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setBid(value);
  };

   useEffect(() => {
  if (auctionData) {
    setIsInCartDB(
      cartItems?.some((item) => item.productId === auctionData._id)
    );
  }
}, [cartItems, auctionData]);

  // เพิ่มสินค้าเข้าตะกร้าใน database
  const addProductToDB = async (product) => {
    try {
      const newProduct = {
        items: {
          productId: product._id?.toString(),
          title: product.title,
          image: product.image,
          artist: product.artist,
          price: bidCurrent,
          quantity: 1,
        },
      };
      await axios.post(`${baseURL}/api/cart-add`, newProduct, {
        withCredentials: true,
      });
      setCartItems((prev) => [...prev, newProduct.items]);
    } catch (err) {
      console.error("Add to cart failed:", err.response?.data || err.message);
    }
  };

  // ลบสินค้าออกจากตะกร้าใน database
  const removeProductFromDB = async (product) => {
    try {
      await axios.delete(`${baseURL}/api/cart-delete/${product._id}`, {
        withCredentials: true,
      });
      setCartItems((prev) =>
        prev.filter((item) => item.productId !== product._id)
      );
    } catch (err) {
      console.error(
        "Remove from cart failed:",
        err.response?.data || err.message
      );
    }
  };




  if (!auctionData) {
    return (
      <div className="flex justify-center items-center h-screen">
        Product not found
      </div>
    );
  }



  return (
    <div className="min-h-screen w-full bg-[#f2eee7] text-[#62483A]">
      <main className="container xl:w-[85%]  mx-auto py-8 px-4">
        <h1 className="text-[2rem] font-bold mb-4">Auction</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex flex-col items-center p-6 bg-[#e4dcd2b4] rounded-lg shadow-lg overflow-hidden">
              <img
                src={auctionData.image}
                alt={auctionData.title}
                className="lg:w-[60%] object-cover shadow-md shadow-gray-600 hover:scale-105 hover:duration-900 duration-900"
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-[#62483a] mb-2">
                  {auctionData.title}
                </h2>
                <p className="text-[#757575] mb-4">
                  Artist: {auctionData.artist}
                </p>
                <p className="text-[#49352a]">{auctionData.description}</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center pl-0 bg-[#f0e0d0] rounded-lg shadow-md p-6 mb-6 hover:scale-102 hover:duration-700 duration-700">
              <div className="flex items-center mb-4">
                <span className="text-[#62483a] mr-2">
                  <ClockIcon />
                </span>
                <h3 className="text-lg font-semibold text-[#62483a]">
                  Time Left
                </h3>
              </div>
              <div className="w-full h-[55px] flex justify-center pl-15 pt-1">
                <RemainingBlock timeLeft={timeLeft} paddingLeft="0" />
              </div>
            </div>

            <div className=" flex flex-col items-center pl-0 bg-white rounded-lg shadow-md p-6 mb-6 hover:scale-102 hover:duration-700 duration-700">
              <div className="flex flex-col items-start">
                <div className="flex items-center mb-3">
                  <span className="text-[#62483a] mr-2">
                    <ChartIcon />
                  </span>
                  <h3 className="text-lg font-semibold text-[#62483a]">
                    Current Bid Price
                  </h3>
                </div>
                <div className="text-3xl font-bold text-[#62483a] mb-1">
                  ${bidCurrent.toLocaleString()}
                </div>
                <div className="text-sm text-[#757575]">
                  Starting Bid Price: $1
                </div>
              </div>
            </div>

            <div className="bg-[#f9f7f3] rounded-lg shadow-md p-6 mb-6 border border-[#e9e2d6] hover:scale-102 hover:duration-700 duration-700">
              <div className="flex items-center mb-3">
                <span className="text-[#62483a] mr-2">
                  <DollarIcon />
                </span>
                <h3 className="text-lg font-semibold text-[#62483a]">
                  Auction
                </h3>
              </div>
              {isAuctionEnded ? (
                <div className="text-center text-xl text-green-700 font-bold">
                  Auction ended!
                  <div className="mt-2">
                    Winner:{" "}
                    {historyBid.length > 0
                      ? `${historyBid[0].firstName} ${historyBid[0].lastName} ($${historyBid[0].amount})`
                      : "No winner"}
                  </div>
                  {historyBid.length > 0 &&
                    user &&
                    user._id === historyBid[0].user?._id && (
                      <ButtonSubmit
                        label={isInCartDB ? "Remove from Cart" : "Add to Cart"}
                        onClick={() => {
                          if (isInCartDB) {
                            removeProductFromDB(auctionData);
                          } else {
                            addProductToDB(auctionData);
                          }
                        }}
                        borderRadius="6px"
                        marginTop="16px"
                      />
                    )}
                </div>
              ) : isAuthenticated ? (
                <form onSubmit={bidButton}>
                  <div className="mb-4">
                    <label
                      htmlFor="bidAmount"
                      className="block text-sm font-medium text-[#49352a] mb-1"
                    >
                      Bid Price (USD)
                    </label>
                    <input
                      type="number"
                      value={bid}
                      onChange={noDecimal}
                      placeholder="Enter your Bid Price"
                      className="w-full px-4 py-2 border border-[#9f8e84] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c2a78f]"
                      required
                    />
                    {errorMessage && (
                      <p className="mt-2 text-red-700 text-sm">
                        {errorMessage}
                      </p>
                    )}
                  </div>

                  <ButtonSubmit
                    onClick={bidButton}
                    label="Bid Now"
                    borderRadius="6px"
                    marginTop="2px"
                  />
                </form>
              ) : (
                <p className="text-sm text-red-700 mt-2">
                  Please{" "}
                  <Link to="/login" className="underline font-bold">
                    login{" "}
                  </Link>
                  to place a bid.
                </p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:scale-102 hover:duration-700 duration-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-[#62483a] mr-2">
                    <HistoryIcon />
                  </span>
                  <h3 className="text-lg font-semibold text-[#62483a]">
                    Auction History
                  </h3>
                </div>
                <span className="text-sm text-[#757575]">
                  {historyBid.length} History
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {historyBid.map((b, i) => (
                  <div
                    key={i}
                    className="border-b border-[#e9e2d6] py-3 last:border-0"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-[#9f8e84] mr-2">
                          <PersonIcon />
                        </span>
                        <span className="text-[#49352a] font-medium">
                          {b.firstName} {b.lastName}
                        </span>
                      </div>
                      <span className="font-semibold text-[#62483a]">
                        ${b.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-[#757575]">
                      {b.time.toLocaleString("en-US", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
