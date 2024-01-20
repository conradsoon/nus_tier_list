<script>
  import { onMount } from "svelte";
  import { Link } from "svelte-routing";

  let things = []; // Initialize an empty array for the items from the API

  // Fetch data from the API endpoint
  onMount(async () => {
    const response = await fetch("http://localhost:4000/thing"); // Replace with your API endpoint URL
    things = await response.json();
  });
</script>

<header>
  <!-- Resize the image to be 300px in width -->
  <img src="nustierlist.png" alt="Nustierlist Image" style="width: 300px;" />
</header>

<!-- Adding "Rank Stuff" and "Submit Stuff" links -->
<div class="links">
  <Link to="/rank" class="blue-link" style="margin: 10px;"
    ><b><i><u>rank things</u></i></b></Link
  >
  <Link to="/rank" class="blue-link" style="margin: 10px;"
    ><b><i><u>submit things</u></i></b></Link
  >
</div>
<main>
  <!-- Creating a tier list with tiers stacked on top of each other -->
  <div class="tier-list">
    <div class="tier">
      <div class="tier-header">S Tier</div>
      <ul>
        {#each things as thing}
          <li>
            <span>{thing.name}</span>
            <!-- Display the item name -->
            <span class="elo">{thing.eloRanking}</span>
            <!-- Display the Elo ranking to the right -->
          </li>
        {/each}
      </ul>
    </div>
    <!-- Add more tiers here -->
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
    border: 1px solid #ddd;
    padding: 5px;
    margin: 2px;
  }

  /* Styling for the links */
  .links {
    display: flex;
    justify-content: center; /* Center the links horizontally */
    margin-top: 20px;
  }

  .blue-link {
    color: blue;
    font-family: "Comic Sans MS", cursive;
    text-decoration: none;
    font-size: 1.2em;
    margin: 10px; /* Add margin to space the links */
  }
</style>
