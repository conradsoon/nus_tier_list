<script>
  import { Link } from "svelte-routing";
  let isSubmitDisabled = true; // Set this flag based on your logic
</script>

<header>
  <!-- Resize the image to be 300px in width -->
  <img src="nustierlist.png" alt="Nustierlist Image" style="width: 300px;" />
  <!-- add a centred quote -->
  <div>"a good quote for the website"</div>

  <!-- Adding "Rank Stuff" and "Submit Stuff" links -->
  <div class="links">
    <Link to="/" class="blue-link" style="margin: 10px;"
      ><b><i><u>tier list</u></i></b></Link
    >
    <Link to="/rank" class="blue-link" style="margin: 10px;"
      ><b><i><u>rank things</u></i></b></Link
    >
    <!-- Conditional rendering and styling for the "Submit Stuff" link -->
    {#if isSubmitDisabled}
      <span class="disabled-link" style="margin: 10px;"
        ><b><i><u>submit things</u></i></b></span
      >
    {:else}
      <Link to="/submit" class="blue-link" style="margin: 10px;"
        ><b><i><u>submit things</u></i></b></Link
      >
    {/if}
  </div>
</header>

<style>
  header {
    text-align: center;
    margin-top: 20px;
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
  /* Styling for the disabled link */
  .disabled-link {
    color: #ccc; /* Gray out the link */
    /* font-family: "Comic Sans MS", cursive; */
    text-decoration: none;
    font-size: 0.9em;
    margin: 10px; /* Add margin to space the links */
    pointer-events: none; /* Disable pointer events on the link */
  }
</style>
