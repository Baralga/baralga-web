<script>
  import { Router, Link, Route } from "svelte-routing";
  import AddActivity from "./AddActivity.svelte";
  import Home from "./Home.svelte";
</script>

<style>

</style>

<Router>
  <Route path="/activity/*" component={AddActivity} />
  <Route path="/" component="{Home}"/>
</Router>
