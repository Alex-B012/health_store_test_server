const handleNodemonRestart = async (shutdown) => {
  console.log("Nodemon restart detected...");
  await shutdown();
  process.kill(process.pid, "SIGUSR2");
};

const handleServerError = (
  res,
  error,
  defaultMessage = "Something went wrong",
) => {
  console.error("ERROR:", error);

  if (!res.headersSent) {
    res.status(500).json({
      success: false,
      message: error?.message || defaultMessage,
    });
    return true;
  }
  return false;
};

const normalizeAPIKey = (str) =>
  String(str || "").replace(/[\r\n\s\u00A0]/g, "");

const getSellersArray = () => {
  const SELLER_ID = Number(process.env.SELLER_ID);
  return [{ name: "Seller3", telegram_user_id: SELLER_ID }];
};

const isAuthorizedSeller = (sellers, userId) => {
  if (!Array.isArray(sellers)) return false;
  return sellers.some((seller) => seller.telegram_user_id === Number(userId));
};

function parseEnvArray(envVar) {
  if (!envVar) return [];
  console.log("envVar - start:", envVar);

  try {
    const parsed = JSON.parse(envVar);
    console.log("parsed - ", parsed);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch (err) {
    return envVar.split(",").map((s) => s.trim());
  }

  return [];
}

const uniqueByName = (arr) => {
  const seen = new Map();
  arr.forEach((item) => {
    if (!seen.has(item.name)) {
      seen.set(item.name, item);
    }
  });
  return Array.from(seen.values());
};

const formatDate = (date) => {
  const d = new Date(date);

  const pad = (n) => String(n).padStart(2, "0");

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());

  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
};

export {
  handleNodemonRestart,
  handleServerError,
  normalizeAPIKey,
  getSellersArray,
  isAuthorizedSeller,
  parseEnvArray,
  uniqueByName,
  formatDate,
};
