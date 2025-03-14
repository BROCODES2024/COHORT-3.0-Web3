export function CreateCpPool({ token }) {
  function createPool() {
    console.log("Creating liquidity pool for", token.toBase58());
  }

  return (
    <div>
      <h2>Constant Product Pool</h2>
      <button onClick={createPool}>Create Pool</button>
    </div>
  );
}
