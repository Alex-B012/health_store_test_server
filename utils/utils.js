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
    return true; // response sent
  }
  return false; // response already sent
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

export {
  handleNodemonRestart,
  handleServerError,
  normalizeAPIKey,
  getSellersArray,
  isAuthorizedSeller,
};
