import { ConnectKitButton } from "connectkit";

export default function Navbar() {
  return (
    <div className="border-2 border-black flex justify-evenly items-center max-w-[1000px] w-[100%] h-[50px]">
      <span className="text-2xl font-bold">Token-Bridge</span>
      <ConnectKitButton />
    </div>
  );
}
