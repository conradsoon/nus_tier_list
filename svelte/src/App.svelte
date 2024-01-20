<!-- App.svelte -->
<script>
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./Home.svelte";
  import Rank from "./Rank.svelte";
</script>

<Router>
  <Route path="/" component={Home} />
  <Route path="/rank" component={Rank} />
</Router>
