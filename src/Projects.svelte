<script>
  import { navigate } from "svelte-routing";
  import { projectStore, deleteProject, addProject } from "./stores.js";

  let name = "";

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

  function cancel() {
    back();
  }
</script>

<style>

</style>

<h1 class="title">Manage Projects</h1>

<div class="field">
  <label class="label">Name</label>
  <div class="field-body">
    <div class="field">
      <p class="control">
        <input class="input" type="text" bind:value={name} />
      </p>
    </div>
    <div class="field">
      <div class="control">
        <span class="button is-success" on:click={add}>
          <span class="icon is-medium">
            <i class="fa fa-plus" />
          </span>
        </span>
      </div>
    </div>
  </div>
</div>

<nav class="panel">
  {#each $projectStore as project}
    <div class="panel-block">
      <span
        class="panel-icon"
        title="Delete {project.name}"
        on:click={() => deleteProject(project)}>
        <i class="fas fa-trash" aria-hidden="true" />
      </span>
      {project.name}
    </div>
  {/each}
</nav>

<div class="field is-grouped">
  <p class="control">
    <button class="button" on:click={cancel}>Cancel</button>
  </p>
</div>
