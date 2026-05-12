const getRole = (req, res) => {
  console.log("getRole - start");

  const { permission_role } = req || {};
  try {
    let role = "";
    if (permission_role === "admin" || permission_role === "manager")
      role = permission_role;

    res.json({
      success: true,
      role: role,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

const getAllProducts = (req, res) => {
  res.json({ success: true, products: [] });
};

const getProductById = (req, res) => {
  const { id } = req.params;
};

const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, price, pharmacy_id } = req.body;
};

const deleteProduct = (req, res) => {
  const { id } = req.params;
};

const getAllPharmacies = (req, res) => {};

const getPharmacyById = (req, res) => {
  const { id } = req.params;
};

const addPharmacy = (req, res) => {
  const { name, address } = req.body;
};

const updatePharmacy = (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;
};

const deletePharmacy = (req, res) => {
  const { id } = req.params;
};

const getAllSellers = (req, res) => {};

const getSellerById = (req, res) => {
  const { id } = req.params;
};

const addSeller = (req, res) => {
  const { name, telegram_user_id } = req.body;
};

const updateSeller = (req, res) => {
  const { id } = req.params;
  const { name, telegram_user_id } = req.body;
};

const deleteSeller = (req, res) => {
  const { id } = req.params;
};

const getAllManagers = (req, res) => {};
const getManagerById = (req, res) => {
  const { id } = req.params;
};
const addManager = (req, res) => {
  const { name, telegram_user_id } = req.body;
};

const updateManager = (req, res) => {
  const { id } = req.params;
  const { name, telegram_user_id } = req.body;
};

const deleteManager = (req, res) => {
  const { id } = req.params;
};

const getRoles = (req, res) => {
  res.json({ success: true, roles: [] });
};

const addRole = (req, res) => {
  const { name, permissions } = req.body;
};

const updateRole = (req, res) => {
  const { id } = req.params;
  const { name, permissions } = req.body;
};

const deleteRole = (req, res) => {
  const { id } = req.params;
};

export {
  getRole,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllPharmacies,
  getPharmacyById,
  addPharmacy,
  updatePharmacy,
  deletePharmacy,
  getAllSellers,
  getSellerById,
  addSeller,
  updateSeller,
  deleteSeller,
  getAllManagers,
  getManagerById,
  addManager,
  updateManager,
  deleteManager,
  getRoles,
  addRole,
  updateRole,
  deleteRole,
};
