<script>
  import { Router, Link, Route } from "svelte-routing";
  import EditActivity from "./EditActivity.svelte";
</script>

<style>
</style>

<Router>
  <Route>
    <EditActivity />
  </Route>
  <Route path=":id" let:params>
    <EditActivity id={params.id} />
  </Route>
</Router>
