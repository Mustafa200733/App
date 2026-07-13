export default function Button({ children }) {
  return (
    <button className="bg-black text-white px-5 py-3 rounded-lg">
      {children}
    </button>
  );
}