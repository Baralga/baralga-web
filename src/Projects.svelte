<script>
  import { navigate, Router, Link, Route } from "svelte-routing";
  import { projectStore, addProject } from "./stores.js";
  import DeleteProject from "./DeleteProject.svelte";

  let name = "";

  $: isValidName = validateName(name);

  function validateName(name) {
    return name && name.length >= 3;
  }

  function back() {
    navigate("/", { replace: true });
  }

  function add() {
    let project = {
      name: name
    };

    addProject(project);

    name = "";
  }
</script>

<style>

</style>

<Router>
  <Route path=":id/delete" let:params>
    <DeleteProject id={params.id} />
  </Route>
  <Route>

    <h1 class="title">Projects</h1>

    <div class="columns is-multiline">
      <div class=" column is-12">

        <div class="field">
          <label class="label">Name</label>

          <div class="field has-addons">
            <div class="control">
              <input
                class="input"
                minlength="3"
                maxlength="200"
                type="text"
                bind:value={name} />
            </div>
            <div class="control">
              <button
                class="button is-success"
                disabled={!isValidName}
                on:click={add}>
                <span class="icon is-medium">
                  <i class="fa fa-plus" />
                </span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {#each $projectStore as project}
        <div class=" column is-12">
          <div class="card" title={project.name}>
            <header class="card-header">
              <p class="card-header-title">{project.name}</p>

              <a href="/projects/{project.id}/delete" class="card-header-icon">
                <span class="icon">
                  <i class="fas fa-trash" aria-hidden="true" />
                </span>
              </a>
            </header>

          </div>
        </div>
      {/each}

      <div class=" column is-12">
        <div class="field is-grouped">
          <p class="control">
            <button class="button" on:click={back}>Back</button>
          </p>
        </div>
      </div>

    </div>
  </Route>
</Router>
