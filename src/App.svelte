<script>
  import { Router, Link, Route } from "svelte-routing";
  import Activity from "./Activity.svelte";
  import Home from "./Home.svelte";
</script>

<style>

</style>

<Router>
  <Route path="/activity/*" component={Activity} />
  <Route path="/" component="{Home}"/>
</Router>
