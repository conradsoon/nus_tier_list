<script>
  import { onMount } from "svelte";
  import Header from "./Header.svelte"; // Import the Header component

  let things = []; // Initialize an empty array for the items from the API
  let tiers = { S: [], A: [], B: [], C: [], D: [], E: [], F: [], Unranked: [] }; // Object to hold tiers

  // Fetch data from the API endpoint
  const fetchData = async () => {
    const response = await fetch(
      "http://nustierlistv1.conradsoon.me:4000/thing"
    );
    things = await response.json();

    // Sort things by eloRanking in descending order
    things.sort((a, b) => b.eloRanking - a.eloRanking);

    // Divide sorted things into tiers
    Object.keys(tiers).forEach((tier, index) => {
      tiers[tier] = things.slice(index * 5, (index + 1) * 5);
    });
  };
  const calculateArrow = (newElo, oldElo) => {
    const change = newElo - oldElo;
    if (change > 20) {
      return { arrow: "↑", class: "up-arrow" };
    } else if (change < -20) {
      return { arrow: "↓", class: "down-arrow" };
    } else {
      return { arrow: "~", class: "mid-error" };
    }
  };
  const interval = setInterval(fetchData, 5000);
  onMount(fetchData());
</script>

<Header></Header>

<main>
  <div class="tier-list">
    {#each Object.entries(tiers) as [tierName, tierThings]}
      {#if tierThings.length > 0}
        <div class="tier">
          <div class="tier-header">{tierName} Tier</div>
          <ul>
            {#each tierThings as thing}
              <li>
                <span>{thing.name}</span>
                <span class="elo">{Math.round(thing.eloRanking)}</span>
                {#if thing.oldEloRanking !== undefined}
                  <span
                    class={calculateArrow(thing.eloRanking, thing.oldEloRanking)
                      .class}
                  >
                    {calculateArrow(thing.eloRanking, thing.oldEloRanking)
                      .arrow}
                    {Math.round(thing.oldEloRanking)}
                  </span>
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    {/each}
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 70%; /* Increase width for the tier list */
    margin: 0 auto;
  }

  header {
    text-align: center;
    margin-top: 20px;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (max-width: 640px) {
    main {
      max-width: none; /* Maximize width for smaller screens like phones */
    }
  }

  /* Styling for the tier list container */
  .tier-list {
    display: flex;
    flex-direction: column; /* Stack tiers vertically */
    align-items: center; /* Center tiers horizontally */
  }

  /* Styling for each tier */
  .tier {
    border: 1px solid #ddd;
    padding: 5px; /* Reduce padding */
    width: 80%; /* Increase width */
    margin: 10px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    background-color: #ffffff;
  }

  .tier-header {
    background-color: #f2f2f2;
    text-align: center;
    font-weight: bold;
    padding: 5px;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: flex;
    justify-content: space-between; /* Aligns content to start and end of the container */
    border: 1px solid #ddd;
    padding: 5px;
    margin: 2px;
  }

  .elo {
    margin-left: auto; /* Pushes the element to the far right */
  }

  .up-arrow {
    color: green;
  }

  .down-arrow {
    color: red;
  }

  .mid-error {
    color: orange;
  }
</style>
