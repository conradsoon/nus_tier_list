//logic for elo rating
//process past 5 minutes

const {
  db,
  getComparisonsSince,
  updateEloRankings,
  getThings,
  getThingsById,
  getUnprocessedComparisons,
  setProcessed,
} = require("../db/db");
const k_factor = 32;

function getUniqueIds(comparisons) {
  const uniqueIds = new Set();
  comparisons.forEach((comparison) => {
    uniqueIds.add(comparison.tid1);
    uniqueIds.add(comparison.tid2);
  });
  //convert to array and return
  return Array.from(uniqueIds);
}

function getExpectedScore(ra, rb) {
  qa = Math.pow(10, ra / 400);
  qb = Math.pow(10, rb / 400);
  // return Math.round(qa / (qa + qb));
  return qa / (qa + qb);
}

function getUpdatedScore(ra, sa, ea) {
  return ra + k_factor * (sa - ea);
}

async function processComparisons() {
  //get date tiem string of the time 5 minutes ago
  const sinceDatetime = new Date(Date.now() - 5 * 60 * 1000);
  getUnprocessedComparisons()
    .then((comparisons) => {
      //dedup
      uniqueIds = getUniqueIds(comparisons);
      //get the things
      getThingsById(uniqueIds) //list
        .then((things) => {
          console.log(things);
          //update elo scores
          expected_scores = new Map();
          //init all unique ids to 0
          actual_scores = new Map();
          console.log("unique ids", uniqueIds);
          uniqueIds.forEach((id) => {
            //set all expected scores to 0
            expected_scores.set(id, 0);
            //set all actual scores to 0
            actual_scores.set(id, 0);
          });
          //start processing each match
          comparisons.forEach((c) => {
            //get the things
            t1 = things.get(c.tid1);
            t2 = things.get(c.tid2);
            // expected_scores[t1] += getExpectedScore(t1.elo, t2.elo);
            // expected_scores[t2] += getExpectedScore(t2.elo, t1.elo);
            // actual_scores[c.tid_better] += 1;
            //set the expected scores
            expected_scores.set(
              c.tid1,
              expected_scores.get(c.tid1) +
                getExpectedScore(t1.eloRanking, t2.eloRanking)
            );
            expected_scores.set(
              c.tid2,
              expected_scores.get(c.tid2) +
                getExpectedScore(t2.eloRanking, t1.eloRanking)
            );
            actual_scores.set(c.tidBetter, actual_scores.get(c.tidBetter) + 1);
          });
          uniqueIds.forEach((id) => {
            newElo = getUpdatedScore(
              things.get(id).eloRanking,
              actual_scores.get(id),
              expected_scores.get(id)
            );
            console.log(newElo);
            //update the elo ranking
            things.get(id).eloRanking = newElo;
          });
          console.log(expected_scores);
          console.log(actual_scores);
          console.log(things);
          updateEloRankings(things)
            .then(() => {
              console.log("Elo rankings updated");
            })
            .catch((err) => {
              console.error("Error updating elo rankings:", err);
              return err;
            });
          setProcessed(comparisons.map((c) => c.id))
            .then(() => {
              console.log("Comparisons marked as processed");
            })
            .catch((err) => {
              console.error("Error marking comparisons as processed:", err);
              return err;
            });
        })
        .catch((err) => {
          console.error("Error retrieving things:", err);
        });
      console.log("Comparisons since", sinceDatetime, ":", comparisons);
    })
    .catch((err) => {
      console.error("Error retrieving comparisons:", err);
      return err;
    });
}

module.exports = { processComparisons };
