<script>
  import { Router, Link, Route } from "svelte-routing";
  import Activity from "./Activity.svelte";
  import Projects from "./Projects.svelte";
  import Home from "./Home.svelte";
</script>

<style>

</style>

<Router>
  <Route path="/activities/*" component={Activity} />
  <Route path="/projects/*" component={Projects} />
  <Route path="/" component="{Home}"/>
</Router>
