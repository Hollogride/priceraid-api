const storeService = require("../services/store.service");
const { AppError } = require("../middleware/error.middleware");

const getAllStores = async (req, res, next) => {
  try {
    const stores = await storeService.findAll();
    res.status(200).json({ success: true, data: stores });
  } catch (err) {
    next(err);
  }
};

const getStoreById = async (req, res, next) => {
  try {
    const store = await storeService.findById(req.params.id);
    if (!store) throw new AppError("Store not found", 404);
    res.status(200).json({ success: true, data: store });
  } catch (err) {
    next(err);
  }
};

const createStore = async (req, res, next) => {
  try {
    const store = await storeService.create(req.body);
    res.status(201).json({ success: true, data: store });
  } catch (err) {
    next(err);
  }
};

const updateStore = async (req, res, next) => {
  try {
    const store = await storeService.update(req.params.id, req.body);
    if (!store) throw new AppError("Store not found", 404);
    res.status(200).json({ success: true, data: store });
  } catch (err) {
    next(err);
  }
};

const deleteStore = async (req, res, next) => {
  try {
    await storeService.remove(req.params.id);
    res.status(200).json({ success: true, data: { message: "Store deleted successfully" } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllStores, getStoreById, createStore, updateStore, deleteStore };
