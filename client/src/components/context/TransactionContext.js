import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../../utils/constants";

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethers);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(
    contractABI,
    contractAddress,
    signer
  );

  return transactionsContract;
};

export const TransactionProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transacionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [transactions, setTransaction] = useState([]);

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const walletValidate = async () => {
    try {
      if (!ethereum) return alert("please connect wallter");

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("no account is found");
      }
    } catch (err) {
      console.log(err);
      throw new Error("No wallets listed");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ether) return alert("Please connect metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrrentAccount(accounts[0]);
    } catch (err) {
      console.log("there was a problem with your wallet");
      throw new Error(err);
    }
  };
};
