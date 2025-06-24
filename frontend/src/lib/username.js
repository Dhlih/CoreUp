export default function generateUsername(fullName) {
  if (!fullName) return "";

  const words = fullName.trim().split(" ").slice(0, 2);
  let username = "";

  for (let word of words) {
    username += word.slice(0, 2); // ambil 2 huruf awal
  }

  return username.toUpperCase();
}
