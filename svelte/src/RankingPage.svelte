<!-- RankingPage.svelte -->
<script>
  let choice = null;

  function selectLeft() {
    choice = "Left Box";
  }

  function selectRight() {
    choice = "Right Box";
  }
</script>

<div class="ranking-page">
  <div class="box" on:click={selectLeft}>Left Box</div>
  <div class="box" on:click={selectRight}>Right Box</div>
  {#if choice}
    <p>You selected: {choice}</p>
  {/if}
</div>

<style>
  .ranking-page {
    display: flex;
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
  }

  p {
    font-size: 18px;
    margin-top: 20px;
  }
</style>
