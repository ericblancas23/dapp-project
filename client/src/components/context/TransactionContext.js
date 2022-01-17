import { useEffect, useState, createContext } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../../utils/constants";

const { ethereum } = window;

export const TransactionContext = createContext();

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

  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionContract = createEthereumContract();
        const availableTransactions =
          await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map(
          (transaction) => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(
              transaction.timestamp.toNumber() * 1000
            ).toLocaleString(),
            message: transaction.message,
            keyword: transaction.keyword,
            amount: parseInt(transaction.amount._hex) / 10 ** 18,
          })
        );

        setTransactions();
      } else {
        console.log("ethereum is not present");
      }
    } catch (err) {
      console.log(err);
      throw new Error(
        "something is wrong with your ethereum, please try again"
      );
    }
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
      if (!ethereum) return alert("Please connect metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrrentAccount(accounts[0]);
    } catch (err) {
      console.log("there was a problem with your wallet");
      throw new Error(err);
    }
  };

  const transactionValidation = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();
        const currentTransactionCount =
          await transactionsContract.getTransactionCount();

        window.localStorage.setItem(
          "transactionCount",
          currentTransactionCount
        );
      }
    } catch (err) {
      console.log(err);
      throw new Error("false transaction");
    }
  };

  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const { addressTo, amount, keyowrd, message } = formData;
        const transactionsContract = createEthereumContract();
        const parsedAmount = await transactionsContract.addToBlockChain(
          addressTo,
          parsedAmount,
          message,
          keyword
        );

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        const transactionsCount =
          await transactionsContract.getTransactionCount();
        setTransactionCount(transactionsCount.toNumber());
      } else {
        console.log("no ethereum object");
      }
    } catch (err) {
      console.log(err);
      throw new Error("transaction not valid");
    }
  };

  useEffect(() => {
    walletValidate();
    transactionValidation();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
