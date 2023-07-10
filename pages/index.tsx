import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Button, Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { arbitrum, bsc, mainnet, polygon } from "wagmi/chains";
import { useAccount, useContract, useSigner } from "wagmi";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "../firebase";
const chains = [bsc];
const projectId = "b45cd42eda39ee4449d97896b80bb6bb";
import "firebase/auth";
import axios from "axios";
import { HttpProvider } from "web3";
import { ethers } from "ethers";

import { providers } from "ethers";
import SID, { getSidAddress } from "@siddomains/sidjs";

const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
});

const ethereumClient = new EthereumClient(wagmiClient, chains);

// Define a default function component called Axen AI Rephraser
export default function AxenAIRephraser() {
  // Define three state variables for the original text, paraphrased text, and paraphrase mode
  const [isAuth, setIsAuth] = useState(false);
  const [isWalletAuth, setIsWalletAuth] = useState(false);
  const [walletName, setWalletName] = useState("");

  const [originalText, setOriginalText] = useState<string>("");
  const [paraphrasedText, setParaphrasedText] = useState<string>("");
  const [paraphraseMode, setParaphraseMode] = useState<string>("Standard");
  const [language, setLanguage] = useState<string>("English");

  // Define a ref for the text area element
  const textAreaRef = useRef(null);

  // Define a state variable for the loading state of the paraphrasing operation
  const [loading, setLoading] = useState<boolean>(false);

  // Construct a prompt string based on the original text and paraphrase mode
  const prompt = `Rephrase "${originalText}" using ${paraphraseMode} mode. Do not add any additional words. In ${language} Language.`;
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const handleConnectionChange = (newIsConnected: boolean) => {
      setIsAuth(newIsConnected);
      setIsWalletAuth(newIsConnected);
      console.log(newIsConnected);
    };

    handleConnectionChange(isConnected);
  }, [isConnected]);

  let UID = auth.currentUser?.uid;
  let name = auth.currentUser?.displayName;
  let photo =
    auth.currentUser?.photoURL ||
    "https://images.unsplash.com/photo-1630568321790-65edcc51b544?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();

    return setPersistence(auth, browserSessionPersistence)
      .then(() => {
        // Existing and future Auth states are now persisted in the current session only.
        // Closing the window would clear any existing state even if a user forgets to sign out.
        // New sign-in will be persisted with session persistence.
        return signInWithPopup(auth, provider);
      })
      .then((userCredential: { user: any }) => {
        // User signed in successfully
        const user = userCredential.user;

        setIsAuth(true);
        return user;
      })
      .catch((error: { code: any; message: any }) => {
        // Handle Errors here
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Sign-in error:", errorCode, errorMessage);
        throw error;
      });
  };

  const signOutButton = () => {
    auth
      .signOut()
      .then(() => {
        // Sign-out successful
        console.log("User signed out");
        setIsAuth(false);
        // Add any additional logic or state updates here
      })
      .catch((error: any) => {
        // An error occurred during sign-out
        console.log(error);
      });
  };

  // Define an async function to handle the paraphrasing operation
  const handleParaphrase = async (e: React.FormEvent) => {
    // Prevent form submission if original text is empty
    if (!originalText) {
      toast.error("Enter text to paraphrase!");
      return;
    }

    // Set the loading state and reset the paraphrased text
    setLoading(true);

    // Send a POST request to the "/api/paraphrase" API endpoint with the prompt in the request body
    const response = await fetch("/api/paraphrase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    // Parse the response as JSON
    const data = await response.json();

    // Set the paraphrased text to the first choice's message content in the response
    console.log(data);
    setParaphrasedText(data.choices[0].message.content);

    // Reset the loading state
    setLoading(false);
  };

  const newAddress: String = address!;

  let sid;
  async function main(address: any) {
    const rpc =
      "https://bsc-mainnet.nodereal.io/v1/d0c3ef1cdb0247f4b6fae228aa76c8b8";
    const provider = new ethers.providers.JsonRpcProvider(rpc);
    const chainId = "56";
    const sid = new SID({ provider, sidAddress: getSidAddress("56") });

    const name = await sid.getName(address);
    console.log("name: %s, address: %s", name, address);
    setWalletName(name.name);
    console.log(walletName);
  }
  useEffect(() => {
    if (isConnected) {
      main(newAddress);
    }
  }, [isConnected, main, newAddress]);

  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <div className="flex flex-col items-center justify-between min-h-screen bg-[url('../public/img/bg.png')] bg-no-repeat bg-cover bg-center w-screen">
          <nav className="bg-white border-gray-200/40 dark:bg-gray-900/40 w-screen">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
              <a href="https://axenai.com/" className="flex items-center">
                <img
                  src="https://cdn.discordapp.com/attachments/1035139393150787675/1082016731003887756/Intersect.png"
                  className="h-8 mr-3"
                  alt="Flowbite Logo"
                />
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white hidden md:block">
                  Rephraser
                </span>
              </a>

              <div className=" w-auto md:block md:w-auto" id="navbar-default">
                {isConnected && (
                  <div className="items-center justify-center flex">
                    {walletName && (
                      <button
                        type="button"
                        className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:ring-[#4285F4]/50 font-medium rounded-full p-2.5 text-sm text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mx-2"
                      >
                        {walletName}
                      </button>
                    )}
                    <Web3Button />
                  </div>
                )}

                {UID && !isConnected && (
                  <div className="">
                    <button
                      type="button"
                      className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:ring-[#4285F4]/50 font-medium rounded-full p-2.5 text-sm text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mx-2"
                    >
                      <img
                        src={photo}
                        alt={UID}
                        className="w-5 h-5 mr-2 border rounded-full"
                      />
                      {name}
                    </button>
                    <button
                      type="button"
                      className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:ring-[#4285F4]/50 font-medium rounded-full p-2.5 text-sm text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mx-2"
                      onClick={signOutButton}
                    >
                      <svg
                        className="w-5 h-5 mr-1"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fab"
                        data-icon="google"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 488 512"
                      >
                        <path
                          fill="currentColor"
                          d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                        ></path>
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}

                {!UID && !isConnected && (
                  <ul className="flex flex-row items-center justify-center">
                    <li className="mx-1">
                      <Web3Button />
                    </li>
                    <li className="mx-1">
                      <button
                        type="button"
                        className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:ring-[#4285F4]/50 font-medium rounded-full p-2.5 text-sm text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 "
                        onClick={signInWithGoogle}
                      >
                        <svg
                          className="w-5 h-5"
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fab"
                          data-icon="google"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 488 512"
                        >
                          <path
                            fill="currentColor"
                            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                          ></path>
                        </svg>
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </nav>

          <main className="max-w-2xl w-full bg-gray-100/20 border rounded-lg border-gray-200/30 shadow-md p-6 mb-4 flex-col flex items-center justify-center">
            <div className="flex-col flex items-center justify-center sm:flex-row w-60">
              <Image
                src="https://cdn.discordapp.com/attachments/1035139393150787675/1074740572264349776/icon.png"
                width={250}
                height={100}
                alt="logo"
                className="m-4 m-y-10"
              />
              <h1 className="text-5xl font-bold text-white">Rephraser</h1>{" "}
            </div>
            <p className="text-sm mb-8 description text-white ">
              Welcome to Axen AI Rephraser, the tool that can help you quickly
              paraphrase text using AI! Simply enter the text you want to
              paraphrase below, select a paraphrase mode, and click on the
              Paraphrase button to see the results!
            </p>
            <div className="mb-4">
              {UID || isConnected ? (
                <textarea
                  onChange={(e) => setOriginalText(e.target.value)}
                  value={originalText}
                  rows={6}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full h-96 p-4 sm:text-lg border-gray-300 rounded-mdplaceholder-gray-400 placeholder-opacity-75 border rounded-lg"
                  placeholder="Enter the text you want to paraphrase here..."
                  ref={textAreaRef}
                ></textarea>
              ) : (
                <textarea
                  onChange={(e) => setOriginalText(e.target.value)}
                  value={originalText}
                  rows={6}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full h-96 p-4 sm:text-lg border-gray-300 rounded-mdplaceholder-gray-400 placeholder-opacity-75 border rounded-lg"
                  placeholder="Login with Google OR connect wallet to use the Rephraser"
                  ref={textAreaRef}
                  disabled
                ></textarea>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block font-medium mb-2"
                htmlFor="paraphraseMode"
              >
                Select a Language:
              </label>
              <select
                onChange={(e) => setLanguage(e.target.value)}
                value={language}
                id="paraphraseMode"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-lg border-gray-300 rounded-md"
              >
                <option value="English">English</option>
                <option value="Arabic">Arabic</option>
                <option value="Chinese">Chinese</option>
                <option value="Dutch">Dutch</option>

                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Hindi">Hindi</option>
                <option value="Italian">Italian</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
                <option value="Persian">Persian</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Russian">Russian</option>
                <option value="Spanish">Spanish</option>
                <option value="Swedish">Swedish</option>
                <option value="Turkish">Turkish</option>
                <option value="Bengali">Bengali</option>
                <option value="Czech">Czech</option>
                <option value="Danish">Danish</option>
                <option value="Finnish">Finnish</option>
                <option value="Greek">Greek</option>
                <option value="Hebrew">Hebrew</option>
                <option value="Hungarian">Hungarian</option>
                <option value="Indonesian">Indonesian</option>
                <option value="Norwegian">Norwegian</option>
                <option value="Polish">Polish</option>
                <option value="Romanian">Romanian</option>
                <option value="Swahili">Swahili</option>
                <option value="Thai">Thai</option>
                <option value="Ukrainian">Ukrainian</option>
                <option value="Vietnamese">Vietnamese</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                className="block font-medium mb-2"
                htmlFor="paraphraseMode"
              >
                Select a paraphrase mode:
              </label>
              <select
                onChange={(e) => setParaphraseMode(e.target.value)}
                value={paraphraseMode}
                id="paraphraseMode"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-lg border-gray-300 rounded-md"
              >
                <option value="Standard">Standard</option>
                <option value="Formal">Formal</option>
                <option value="Creative">Creative</option>
                <option value="Fluent">Fluent</option>
                <option value="Horror">Horror</option>
                <option value="Technical">Techincal</option>
                <option value="Emoji">Emoji</option>
                <option value="Anime">Anime</option>
                <option value="Comedy">Comedy</option>
                <option value="Romantic">Romantic</option>
              </select>
            </div>
            <div className="flex justify-center">
              {UID || isConnected ? (
                <button
                  onClick={handleParaphrase}
                  className="inline-block px-4 py-2 leading-none border rounded-lg text-black bg-gray-100 hover:bg-gray-700 focus:bg-black focus:text-white hover:text-white"
                >
                  Paraphrase
                </button>
              ) : (
                <ul className="flex flex-row items-center justify-center">
                  <li className="mx-1">
                    <Web3Button />
                  </li>
                  <li className="mx-1">
                    <button
                      type="button"
                      className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:ring-[#4285F4]/50 font-medium rounded-full p-2.5 text-sm text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 "
                      onClick={signInWithGoogle}
                    >
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fab"
                        data-icon="google"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 488 512"
                      >
                        <path
                          fill="currentColor"
                          d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                        ></path>
                      </svg>
                    </button>
                  </li>
                </ul>
              )}
            </div>
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{ duration: 3000 }}
            />

            {loading && (
              <div className="loader-overlay">
                <ClipLoader size={60} color={"#ffffff"} loading={loading} />
              </div>
            )}
            {paraphrasedText && (
              <div className="flex flex-col items-center justify-center w-full">
                <h2 className="text-xl font-bold mb-2 flex items-center text-white m-2">
                  Paraphrased Text{" "}
                  <button
                    title="Copy"
                    onClick={() => {
                      navigator.clipboard.writeText(paraphrasedText);
                      toast.success("Copied to clipboard");
                    }}
                    className="bg-gray-100 hover:bg-blue-800 text-black text-lg h-8 w-7 rounded-full ml-3 focus:outline-none cursor-pointer"
                  >
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <rect x="8" y="8" width="12" height="12" rx="2" />
                      <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
                    </svg>
                  </button>
                </h2>
                <p
                  className="p-4 sm:text-lg border-gray-300 rounded-md bg-gray-100 mt-2 sm:mt-0 w-full text-gray-700"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {paraphrasedText}
                </p>
              </div>
            )}
          </main>
          <Toaster />
        </div>
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}
