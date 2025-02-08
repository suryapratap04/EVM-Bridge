import { useState } from "react";

export default function Bridge() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  return (
    <div className="border-2 border-black flex  flex-col justify-evenly items-center max-w-[1000px] w-[100%] min-h-[500px]">
      <div>
        <span>From</span>
        <div>
          <input
            type="text"
            value={from}
            placeholder="Bridge Token From"
            className="border-2 border-black p-2 rounded-md w-[200px]"
          />
        </div>
      </div>
      <div>
        <span>To</span>
        <div>
          <input
            type="text"
            value={to}
            placeholder="Bridge Token To"
            className="border-2 border-black p-2 rounded-md w-[200px]"
          />
        </div>
      </div>
      <div>
        <span>Amount</span>
        <div>
          <input
            type="text"
            value={amount}
            placeholder="Bridge Amount"
            onChange={(e) => setAmount(e.target.value)}
            className="border-2 border-black p-2 rounded-md w-[200px]"
          />
        </div>
      </div>
      <div>
        <button className="border-2 border-black p-2 rounded-md w-[200px]">
          Bridge
        </button>
      </div>
    </div>
  );
}
