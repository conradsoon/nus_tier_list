<script>
  export let name;
</script>

<header>
  <!-- Resize the image to be 300px in width -->
  <img src="nustierlist.png" alt="Nustierlist Image" style="width: 300px;" />
</header>
<!-- Adding "Rank Stuff" and "Submit Stuff" links -->
<div class="links">
  <a href="#" class="blue-link"><b><i><u>rank things</u></i></b></a>
  <a href="#" class="blue-link"><b><i><u>submit things</u></i></b></a>
</div>
<main>
  <!-- Creating a tier list with tiers stacked on top of each other -->
  <div class="tier-list">
    <div class="tier">
      <div class="tier-header">S Tier</div>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
        <li>Item 4</li>
        <li>Item 5</li>
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
