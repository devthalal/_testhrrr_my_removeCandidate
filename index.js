import fs from "fs";
import path from "path";
import { getBody, getDB, sendResponse, shieldApi } from "./utils.js";

/**
 * Remove candidate request hanlder
 * @param {*} req
 * @param {*} res
 */
const removeCandidate = async (req, res) => {
  try {

    if (req.params["health"] === "health") {
      return sendResponse(res, 200, {
        success: true,
        msg: "Health check success",
      });
    }

    const DB_FILE = path.resolve("../localdb.json");
    const localDB = getDB(DB_FILE);
    const { id } = await getBody(req);

    const index = localDB.findIndex((obj) => {
      return obj.id == id;
    });

    if (index !== -1) {
      localDB.splice(index, 1);
      fs.writeFileSync(DB_FILE, JSON.stringify(localDB));
      sendResponse(res, 200, { status: true, msg: "Cadidate removed successfully" });
    } else {
      sendResponse(res, 400, { status: false, msg: "Cadidate not found" });
    }
  } catch (e) {
    sendResponse(res, 500, { status: false, msg: e.message, err: e });
  }
};

export default removeCandidate;
