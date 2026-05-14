import * as SQLite from "expo-sqlite";

// Open the database
const db = SQLite.openDatabaseSync("roadhero_offline.db");

export const initDB = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS offline_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userUID TEXT,
        userEmail TEXT,
        serviceType TEXT,
        address TEXT,
        latitude REAL,
        longitude REAL,
        details TEXT,
        status TEXT,
        createdAt TEXT
    );
  `);
};

export const saveRequestOffline = async (requestData) => {
  const {
    userUID,
    userEmail,
    serviceType,
    address,
    location,
    details,
    status,
    createdAt,
  } = requestData;

  // Convert the 'details' object to a string to store it in SQLite
  const detailsString = JSON.stringify(details);

  await db.runAsync(
    `INSERT INTO offline_requests (userUID, userEmail, serviceType, address, latitude, longitude, details, status, createdAt) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? );`,
    [
      userUID,
      userEmail,
      serviceType,
      address,
      location.latitude,
      location.longitude,
      detailsString,
      status,
      createdAt,
    ],
  );
};
export const getOfflineRequests = async () => {
  try {
    // We use getAllAsync to get all rows from the table
    const allRows = await db.getAllAsync(
      "SELECT * FROM offline_requests ORDER BY createdAt DESC",
    );
    return allRows;
  } catch (error) {
    console.error("Error fetching offline requests:", error);
    return [];
  }
};
export const deleteOfflineRequest = async (id) => {
  try {
    await db.runAsync("DELETE FROM offline_requests WHERE id = ?;", [id]);
  } catch (error) {
    console.error("Error deleting synced request:", error);
  }
};
