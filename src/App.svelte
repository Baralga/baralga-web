<script>
  import moment from "moment/src/moment";
  import { writable, get } from "svelte/store";
  import { activitiesStore, projectStore, totalDuration, addActivity } from "./stores.js";
  import { formatDuration, asFormattedDuration } from "./formatter.js";
  import Projects from "./Projects.svelte";
  import Report from "./Report.svelte";
  import AddActivity from "./AddActivity.svelte";

  let runningActivity = false;
  let startTime;
  let activeProject;
  let selectedProject;
  let description;
  let durationFormatted;

  let updateTimerFunction;

  function updateTimer() {
    let duration = moment.duration(moment().diff(startTime));
    durationFormatted = formatDuration(duration) + " h";
    updateTimerFunction = setTimeout(updateTimer, 5000);
  }

  function stopActivity() {
    runningActivity = false;

    let activity = {
      startTime: startTime,
      endTime: moment().startOf("minute"),
      project: activeProject,
      description: description
    };

    addActivity(activity);

    durationFormatted = null;
    startTime = null;
    description = null;

    clearTimeout(updateTimerFunction);
  }

  function startActivity() {
    runningActivity = true;
    startTime = moment().startOf("minute");
    activeProject = selectedProject;
    updateTimer();
  }
</script>

<style>

</style>

<div class="columns is-multiline">
  <div class="column is-12">
    <div class="field is-grouped">
      <Projects />
      <AddActivity />
    </div>
  </div>
  <div class="column is-12 notification is-primary">
    <div class="columns is-multiline">
      <div class="column is-4">
        {#if runningActivity}
          <a on:click={stopActivity} class="button is-large">
            <span class="icon is-medium">
              <i class="fa fa-stop" />
            </span>
          </a>
        {:else}
          <a on:click={startActivity} class="button is-large">
            <span class="icon is-medium">
              <i class="fa fa-play" />
            </span>
          </a>
        {/if}

        <div class="select is-large">
          <fieldset disabled={runningActivity}>
            <select bind:value={selectedProject}>
              {#each $projectStore as project}
                <option value={project}>{project.name}</option>
              {/each}
            </select>
          </fieldset>
        </div>

        <h3 class="title is-3">
          Start: {(startTime && startTime.format('HH:mm')) || '-'}
          <br />
          Duration: {durationFormatted || '-'}
        </h3>
      </div>
      <div class="column is-6">
        <fieldset disabled={!runningActivity}>
          <textarea
            bind:value={description}
            class="textarea is-primary"
            placeholder="Describe what you do ..." />
        </fieldset>
      </div>
    </div>
  </div>
  <div class="column is-12 notification">
    <Report/>
  </div>
</div>
