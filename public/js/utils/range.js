export function range(to) {
  if (to <= 0) return [];
  
  let output = [];

  for (let i = 0; i < to; i++) {
    output.push(i);
  } 

  return output;
}