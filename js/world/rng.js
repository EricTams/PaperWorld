export function createRng(seedUint) {
  let state = (seedUint >>> 0) || 1;
  return {
    nextFloat() {
      state = nextState(state);
      return state / 4294967296;
    },
    nextInt(maxExclusive) {
      if (maxExclusive <= 0) {
        throw new Error("nextInt requires maxExclusive > 0.");
      }
      return Math.floor(this.nextFloat() * maxExclusive);
    },
    getState() {
      return state >>> 0;
    },
  };
}

function nextState(state) {
  let mixed = state + 0x6d2b79f5;
  mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
  mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
  return (mixed ^ (mixed >>> 14)) >>> 0;
}
