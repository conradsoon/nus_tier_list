const sqlite3 = require("sqlite3").verbose();
const createThingsTable = `
    CREATE TABLE IF NOT EXISTS THINGS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_location TEXT,
        name TEXT NOT NULL,
        submitter_telegram_id TEXT NOT NULL,
        submitter_telegram_handle TEXT NOT NULL,
        elo_ranking INTEGER NOT NULL,
        approved BOOLEAN NOT NULL DEFAULT FALSE
    )
`;

const createComparisonsTable = `
    CREATE TABLE IF NOT EXISTS COMPARISONS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tid1 INTEGER REFERENCES THINGS(id) NOT NULL,
        tid2 INTEGER REFERENCES THINGS(id) NOT NULL,
        tid_better INTEGER REFERENCES THINGS(id) NOT NULL,
        time_evaluated DATETIME NOT NULL,
        processed BOOLEAN NOT NULL DEFAULT FALSE
        
    )
`;

const enableForeignKeySupport = `
    PRAGMA foreign_keys = ON;
`;

class Thing {
  constructor(
    id,
    name,
    imageLocation,
    submitterTelegramId,
    submitterTelegramHandle,
    eloRanking,
    approved
  ) {
    this.id = id;
    this.name = name;
    this.imageLocation = imageLocation;
    this.submitterTelegramId = submitterTelegramId;
    this.submitterTelegramHandle = submitterTelegramHandle;
    this.eloRanking = eloRanking;
    this.approved = false;
  }
}

class Comparison {
  constructor(id, tid1, tid2, tidBetter, timeEvaluated) {
    this.id = id;
    this.tid1 = tid1;
    this.tid2 = tid2;
    this.tidBetter = tidBetter;
    this.timeEvaluated = timeEvaluated;
    this.processed = false;
  }
}

const db = new sqlite3.Database("tierlist.db");

db.serialize(() => {
  db.run(createThingsTable);
  db.run(createComparisonsTable);
  db.run(enableForeignKeySupport);
});

const query = `
    SELECT * FROM COMPARISONS
    WHERE time_evaluated >= DATETIME('now', '-5 minutes')
`;

function getUnprocessedComparisons() {
  return new Promise((resolve, reject) => {
    const query = `
            SELECT * FROM COMPARISONS
            WHERE processed = FALSE
        `;
    db.all(query, async (err, rows) => {
      if (err) {
        reject(err);
      } else {
        try {
          const comparisons = rows.map((row) => {
            return new Comparison(
              row.id,
              row.tid1,
              row.tid2,
              row.tid_better,
              row.time_evaluated
            );
          });
          resolve(comparisons);
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

function getComparisonsSince(sinceDatetime) {
  return new Promise((resolve, reject) => {
    const query = `
            SELECT * FROM COMPARISONS
            WHERE time_evaluated >= ?
        `;
    db.all(query, [sinceDatetime], async (err, rows) => {
      if (err) {
        reject(err);
      } else {
        try {
          const comparisons = rows.map((row) => {
            return new Comparison(
              row.id,
              row.tid1,
              row.tid2,
              row.tid_better,
              row.time_evaluated
            );
          });
          resolve(comparisons);
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

async function getThingsById(ids) {
  return new Promise((resolve, reject) => {
    const placeholders = ids.map(() => "?").join(",");
    const query = `
            SELECT * FROM THINGS
            WHERE id IN (${placeholders})
        `;

    db.all(query, ids, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        try {
          if (rows.length !== ids.length) {
            // Check if the number of retrieved rows matches the number of IDs requested
            throw new Error("Invalid IDs detected");
          }

          const thingsMap = new Map();
          rows.forEach((row) => {
            const thing = new Thing(
              row.id,
              row.name,
              row.image_location,
              row.submitter_telegram_id,
              row.submitter_telegram_handle,
              row.elo_ranking,
              row.approved
            );
            thingsMap.set(row.id, thing);
          });

          resolve(thingsMap);
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

async function setProcessed(ids) {
  return new Promise((resolve, reject) => {
    const placeholders = ids.map(() => "?").join(",");
    const query = `
            UPDATE COMPARISONS
            SET processed = TRUE
            WHERE id IN (${placeholders})
        `;

    db.run(query, ids, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function updateEloRankings(things) {
  return new Promise((resolve, reject) => {
    try {
      const updateStatements = [];
      things.forEach((thing) => {
        const updateStatement = `
                    UPDATE THINGS
                    SET elo_ranking = ?
                    WHERE id = ?
                `;
        updateStatements.push({
          sql: updateStatement,
          params: [thing.eloRanking, thing.id],
        });
      });
      db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        updateStatements.forEach((update) => {
          db.run(update.sql, update.params);
        });
        db.run("COMMIT", () => {
          resolve(things);
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

function verifyComparison(comparison) {}
async function addComparison(comparison) {
  return new Promise((resolve, reject) => {
    const query = `
			INSERT INTO COMPARISONS (tid1, tid2, tid_better, time_evaluated)
			VALUES (?, ?, ?, ?)
		`;
    db.run(
      query,
      [
        comparison.tid1,
        comparison.tid2,
        comparison.tidBetter,
        comparison.timeEvaluated,
      ],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

async function addThing(thing) {
  return new Promise((resolve, reject) => {
    const query = `
			INSERT INTO THINGS (name, image_location, submitter_telegram_id, submitter_telegram_handle, elo_ranking)
			VALUES (?,?, ?, ?, ?)
		`;
    db.run(
      query,
      [
        thing.name,
        thing.imageLocation,
        thing.submitterTelegramId,
        thing.submitterTelegramHandle,
        thing.eloRanking,
      ],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

async function getRandomComparison() {
  return new Promise((resolve, reject) => {
    try {
      // Query the database for two random Thing objects
      const query = `
			  SELECT * FROM THINGS
			  ORDER BY RANDOM()
			  LIMIT 2
		  `;

      db.all(query, async (err, rows) => {
        if (err) {
          reject(err);
        } else {
          try {
            if (rows.length !== 2) {
              throw new Error("Could not retrieve two random Thing objects");
            }

            const things = rows.map((row) => {
              return new Thing(
                row.id,
                row.name,
                row.image_location,
                row.submitter_telegram_id,
                row.submitter_telegram_handle,
                row.elo_ranking,
                row.approved
              );
            });

            resolve(things);
          } catch (error) {
            reject(error);
          }
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function getTopKThings(k) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM THINGS
      ORDER BY elo_ranking DESC
      LIMIT ?
    `;
    db.all(query, [k], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        try {
          const things = rows.map((row) => {
            return new Thing(
              row.id,
              row.name,
              row.image_location,
              row.submitter_telegram_id,
              row.submitter_telegram_handle,
              row.elo_ranking,
              row.approved
            );
          });

          resolve(things);
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

module.exports = {
  db,
  Thing,
  Comparison,
  getComparisonsSince,
  updateEloRankings,
  addComparison,
  getThingsById,
  getUnprocessedComparisons,
  setProcessed,
  getRandomComparison,
  addThing,
  getTopKThings,
};
