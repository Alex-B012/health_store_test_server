// Generate random QR code
const generateQRCode = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomPart = "";

  for (let i = 0; i < 20; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `test_qr_code_${randomPart}`;
};

// Get random element from array
const getRandomFromArray = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Get random date between two dates
function getRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

const now = new Date();

// 2 weeks ago → 1 week ago
const twoWeeksAgo = new Date(now);
twoWeeksAgo.setDate(now.getDate() - 14);

const oneWeekAgo = new Date(now);
oneWeekAgo.setDate(now.getDate() - 7);

export {
  generateQRCode,
  getRandomFromArray,
  getRandomDate,
  twoWeeksAgo,
  oneWeekAgo,
};
