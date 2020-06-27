<script>
  import { Router, Link, Route } from "svelte-routing";
  import moment from "moment/src/moment";
  import { projectStore, getProject, addActivity, updateActivity, getActivity } from "./stores.js";
  import { navigate } from "svelte-routing";
  import EditActivity from "./EditActivity.svelte";

  export let id = undefined;
  let selectedProject;
  let dateValue;
  let timeFromValue;
  let timeToValue;
  let description;

  function validateDate(dateValue) {
    let parsedDate = moment(dateValue, "DD.MM.YYYY", "de", true);
    return parsedDate !== undefined && parsedDate.isValid();
  }

  function validateTime(timeValue) {
    let parsedTime = moment(timeValue, "HH:mm", "de", true);
    return parsedTime !== undefined && parsedTime.isValid();
  }

  function validateAfter(from, to) {
    let parsedFrom = moment(from, "HH:mm", "de", true);
    let parsedTo = moment(to, "HH:mm", "de", true);
    return parsedFrom.isSameOrBefore(parsedTo);
  }

  $: isValidDateValue = validateDate(dateValue);
  $: isValidTimeFrom =
    validateTime(timeFromValue) && validateAfter(timeFromValue, timeToValue);
  $: isValidTimeTo =
    validateTime(timeToValue) && validateAfter(timeFromValue, timeToValue);

  function back() {
    navigate("/", { replace: true });
  }

  function isEditMode() {
    return id !== undefined
  }

  function save() {
    let startTime = moment(dateValue, "DD.MM.YYYY", "de", true);
    let endTime = moment(dateValue, "DD.MM.YYYY", "de", true);

    let parsedTimeFrom = moment(timeFromValue, "HH:mm", "de", true);
    let parsedTimeTo = moment(timeToValue, "HH:mm", "de", true);

    startTime.set("hour", parsedTimeFrom.hours());
    startTime.set("minute", parsedTimeFrom.minutes());

    endTime.set("hour", parsedTimeTo.hours());
    endTime.set("minute", parsedTimeTo.minutes());

    let activity = {
      startTime: startTime,
      endTime: endTime,
      project: selectedProject,
      description: description
    };

    if (isEditMode()) {
      activity.id = id;
      updateActivity(activity);
    } else {
      addActivity(activity);
    }
    back();
  }

  function init() {
    if (id !== undefined) {
      let activity = getActivity(id);
      if (activity !== undefined) {
        selectedProject = getProject(activity.project.id);
        description = activity.description;
        dateValue = activity.startTime.startOf("minute").format("DD.MM.YYYY");
        timeFromValue = activity.startTime.format("HH:mm");
        timeToValue = activity.endTime.format("HH:mm");
        return;
      }
    }

    selectedProject = $projectStore[0];
    description = null;
    dateValue = moment()
      .startOf("minute")
      .format("DD.MM.YYYY");
    timeFromValue = moment().format("HH:mm");
    timeToValue = moment().format("HH:mm");
  }

  function cancel() {
    back();
  }

  init();
</script>

<style>

</style>

<h1 class="title">
  {#if isEditMode()}Update{:else}Add{/if}
  Activity
</h1>

<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label">Project</label>
  </div>
  <div class="field-body">
    <div class="field">
      <div class="select">
        <select bind:value={selectedProject}>
          {#each $projectStore as project}
            <option value={project}>{project.name}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>
</div>

<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label">Date</label>
  </div>
  <div class="field-body">
    <div class="field">
      <div class="control">
        <input
          pattern="[0-3][0-9]\.[0-1][0-9]\.20[0-9]{2}"
          minlength="10"
          maxlength="10"
          class="input"
          class:is-danger={!isValidDateValue}
          bind:value={dateValue}
          type="text"
          placeholder="16.11.2019" />
      </div>
      <!--
            <p class="help is-danger">This field is required</p>
            -->
    </div>
  </div>
</div>

<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label">Start Time</label>
  </div>
  <div class="field-body">
    <div class="field">
      <input
        class="input"
        pattern="[0-9]{2}:[0-5][0-9]"
        bind:value={timeFromValue}
        class:is-danger={!isValidTimeFrom}
        minlength="5"
        maxlength="5"
        type="text"
        placeholder="10:00" />
    </div>
  </div>
</div>

<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label">End Time</label>
  </div>
  <div class="field-body">
    <div class="field">
      <input
        class="input"
        pattern="[0-9]{2}:[0-5][0-9]"
        bind:value={timeToValue}
        class:is-danger={!isValidTimeTo}
        minlength="5"
        maxlength="5"
        type="text"
        placeholder="10:00" />
    </div>
  </div>
</div>

<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label">Description</label>
  </div>
  <div class="field-body">
    <div class="field">
      <textarea
        bind:value={description}
        class="textarea"
        placeholder="Describe what you do ..." />
    </div>
  </div>
</div>

<div class="field">
  <p class="control">

    <button
      class="button is-success"
      disabled={!(isValidDateValue && isValidTimeFrom && isValidTimeTo)}
      on:click={save}>
      {#if isEditMode()}Update{:else}Add{/if}
    </button>
    <button class="button" on:click={cancel}>Cancel</button>

  </p>
</div>
