<script>
  import { Router, Route } from "svelte-routing";
  import Activities from "./Activities.svelte";
  import Projects from "./Projects.svelte";
  import Home from "./Home.svelte";
</script>

<style>

</style>

<Router>
  <Route path="/activities/*" component={Activities} />
  <Route path="/projects/*" component={Projects} />
  <Route path="/" component="{Home}"/>
</Router>
