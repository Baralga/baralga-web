<script>
  import { projectStore, deleteProject, addProject } from "./stores.js";

  let name = "";
  let projectModalVisible = false;

  function show() {
    projectModalVisible = true;
  }

  function hide() {
    projectModalVisible = false;
  }

  function add() {
    let project = {
      name: name
    };

    addProject(project);

    name = "";
  }

  function cancel() {
    hide();
  }
</script>

<style>

</style>

<button class="button is-link" on:click={show}>
  <span class="icon">
    <i class="fas fa-edit" />
  </span>
  <span>Manage Project</span>
</button>

<div class="{projectModalVisible === true ? 'is-active' : ''} modal is-clipped">
  <div class="modal-background" />

  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Manage Projects</p>
      <button class="delete" aria-label="close" on:click={cancel} />
    </header>
    <section class="modal-card-body">

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">Name</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input class="input" type="text" bind:value={name} />
            </p>
          </div>
          <div class="field">
            <p class="control">
              <span class="button" on:click={add}>
                <span class="icon is-medium">
                  <i class="fa fa-plus" />
                </span>
              </span>
            </p>
          </div>
        </div>
      </div>

      <nav class="panel">
        {#each $projectStore as project}
          <div class="panel-block">
            <span class="panel-icon" title="Delete {project.name}" on:click={() => deleteProject(project)}>
              <i class="fas fa-trash" aria-hidden="true" />
            </span>
            {project.name}
          </div>
        {/each}
      </nav>

    </section>
  </div>

  <button class="modal-close is-large" aria-label="close" />
</div>
