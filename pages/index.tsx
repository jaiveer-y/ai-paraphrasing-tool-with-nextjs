import Image from "next/image";
import { useState, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

// Define a default function component called Axen AI Rephraser
export default function AxenAIRephraser() {
  // Define three state variables for the original text, paraphrased text, and paraphrase mode
  const [originalText, setOriginalText] = useState<string>("");
  const [paraphrasedText, setParaphrasedText] = useState<string>("");
  const [paraphraseMode, setParaphraseMode] = useState<string>("Standard");

  // Define a ref for the text area element
  const textAreaRef = useRef(null);

  // Define a state variable for the loading state of the paraphrasing operation
  const [loading, setLoading] = useState<boolean>(false);

  // Construct a prompt string based on the original text and paraphrase mode
  const prompt = `Rephrase "${originalText}" using ${paraphraseMode} mode. Do not add any additional words.`;

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[url('../public/img/bg.png')] bg-no-repeat bg-cover bg-center">
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
          paraphrase text using AI! Simply enter the text you want to paraphrase
          below, select a paraphrase mode, and click on the Paraphrase button to
          see the results!
        </p>
        <div className="mb-4">
          <textarea
            onChange={(e) => setOriginalText(e.target.value)}
            value={originalText}
            rows={6}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full h-96 p-4 sm:text-lg border-gray-300 rounded-mdplaceholder-gray-400 placeholder-opacity-75 border rounded-lg"
            placeholder="Enter the text you want to paraphrase here..."
            ref={textAreaRef}
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2" htmlFor="paraphraseMode">
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
            <option value="Fun">Fun</option>
            <option value="Fluent">Fluent</option>
            <option value="Horror">Horror</option>
            <option value="Technical">Techincal</option>
            <option value="Emoji">Emoji</option>
            <option value="Anime">Anime</option>
            <option value="Comedy">Comedy</option>
          </select>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleParaphrase}
            className="inline-block px-4 py-2 leading-none border rounded-lg text-black bg-gray-100 hover:bg-gray-700 focus:bg-black focus:text-white hover:text-white"
          >
            Paraphrase
          </button>
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
  );
}
