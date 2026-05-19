import * as SQLite from "expo-sqlite";

interface RequestLocation {
  latitude: number;
  longitude: number;
}

interface RequestData {
  userUID: string;
  userEmail: string;
  serviceType: string;
  address: string;
  location: RequestLocation;
  details: Record<string, any>;
  status: string;
  createdAt: string | number;
}

export interface OfflineRequestRow {
  id: number;
  userUID: string;
  userEmail: string;
  serviceType: string;
  address: string;
  latitude: number;
  longitude: number;
  details: string;
  status: string;
  createdAt: string;
}

// Open the database
const db = SQLite.openDatabaseSync("roadhero_offline.db");

export const initDB = async (): Promise<void> => {
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

export const saveRequestOffline = async (
  requestData: RequestData,
): Promise<void> => {
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
      String(createdAt),
    ],
  );
};

export const getOfflineRequests = async (): Promise<OfflineRequestRow[]> => {
  try {
    const allRows = await db.getAllAsync<OfflineRequestRow>(
      "SELECT * FROM offline_requests ORDER BY createdAt DESC",
    );
    return allRows;
  } catch (error) {
    console.error("Error fetching offline requests:", error);
    return [];
  }
};

export const deleteOfflineRequest = async (id: number): Promise<void> => {
  try {
    await db.runAsync("DELETE FROM offline_requests WHERE id = ?;", [id]);
  } catch (error) {
    console.error("Error deleting synced request:", error);
  }
};
