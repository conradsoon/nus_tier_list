<script>
  import { onMount } from "svelte";
  let choices = [];

  async function fetchComparison() {
    const response = await fetch("http://127.0.0.1:4000/comparison"); // Replace with your API endpoint URL
    choices = await response.json();
  }

  // Fetch data from the API endpoint on component mount
  onMount(() => {
    fetchComparison();
  });

  async function selectChoice(choice) {
    console.log("You selected:", choice.name);
    const response = await fetch(
      `http://127.0.0.1:4000/comparison?id1=${choices[0].id}&id2=${choices[1].id}&better_id=${choice.id}`,
      {
        method: "POST",
      }
    );

    if (response.ok) {
      await fetchComparison(); // Wait for the fetchComparison to complete
    } else {
      console.error("Failed to send comparison.");
    }
  }
</script>

<div class="ranking-page">
  {#each choices as choice (choice.id)}
    <div class="box" on:click={() => selectChoice(choice)}>
      {choice.name}
    </div>
  {/each}
</div>

<style>
  .ranking-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .box {
    width: 200px;
    height: 100px;
    background-color: #ccc;
    margin: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 18px;
  }
</style>
