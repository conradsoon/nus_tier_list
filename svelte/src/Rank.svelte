<script>
  import { onMount } from "svelte";
  import Header from "./Header.svelte";
  let choices = [];

  async function fetchComparison() {
    const response = await fetch(
      "http://nustierlistv1.conradsoon.me:4000/comparison"
    ); // Replace with your API endpoint URL
    choices = await response.json();
  }

  // Fetch data from the API endpoint on component mount
  onMount(() => {
    fetchComparison();
  });

  async function selectChoice(choice) {
    console.log("You selected:", choice.name);
    const response = await fetch(
      `http://nustierlistv1.conradsoon.me:4000/comparison?id1=${choices[0].id}&id2=${choices[1].id}&better_id=${choice.id}`,
      {
        method: "POST",
      }
    );

    if (response.ok) {
      //wait for another 500ms
      await new Promise((r) => setTimeout(r, 500));
      await fetchComparison(); // Wait for the fetchComparison to complete
    } else {
      console.error("Failed to send comparison.");
    }
  }
</script>

<Header />
<div class="page-container">
  <!-- Added a container div for centering -->
  <h2 class="centered-heading">which is better?</h2>
  <!-- Added centered-heading class -->
  <div class="ranking-page">
    {#each choices as choice (choice.id)}
      <div class="box" on:click={() => selectChoice(choice)}>
        {choice.name}
      </div>
    {/each}
  </div>
</div>

<style>
  /* Center the heading */
  .centered-heading {
    text-align: center;
  }

  /* Center the container div and its contents */
  .page-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .ranking-page {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap; /* Enable wrapping if the window is too small */
  }

  .box {
    width: 200px;
    height: 100px;
    background-color: #4caf50; /* A cooler color */
    background-image: linear-gradient(
      to right,
      #32a852,
      #4caf50
    ); /* Gradient background */
    margin: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 20px; /* Larger font size */
    font-weight: bold; /* Bold font */
    color: white; /* White text */
    border: 2px solid transparent;
    border-radius: 10px; /* Rounded corners */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow */
    transition: all 0.3s ease; /* Smooth transition for hover effect */
  }

  .box:hover {
    background-color: #367c39; /* Darker shade on hover */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* Larger shadow on hover */
    transform: translateY(-2px); /* Slight raise effect on hover */
  }
</style>
