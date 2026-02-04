export default function Newsletter() {
  return (
    <div className="w-100 h-52 bg-[rgba(255,255,255,0.05)] p-3.75 rounded-[40px] border border-[rgba(255,255,255,0.10)] items-center">
      
      <h3 className="font-semibold mb-4 text-4xl pl-3.5 pr-3.5 gap-3.5">RESTEZ<br />INFORMÉ</h3>
      <form className="grid grid-cols-[1fr_60px] pl-3.5 pr-3.5 gap-3.5 py-2 text-1xl">
        <input
          type="email"
          placeholder="Email Signal"
          className="bg-[rgba(255,255,255,0.05)] p-3.75 rounded-[15px] border border-[rgba(255,255,255,0.10)] text-white placeholder-white focus:outline-none focus:ring-1 focus:ring-white"
        />
        <button
          type="submit"
          className="bg-white text-black font-medium rounded-[15px] px-4 py-2 hover:bg-gray-300 transition"
        >
          OK
        </button>
      </form>
    </div>
  );
}