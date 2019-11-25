<script>
  import moment from "moment/src/moment";
  import {
    filterStore,
    filteredActivitiesStore,
    totalDurationStore,
    applyFilter,
    toFilterLabel
  } from "./stores.js";
  import { formatDuration, asFormattedDuration } from "./formatter.js";

  let selectedTimespan = "year";
  let filterLabel = "";

  let timespanFrom;
  let timespanTo;

  function updateFilter() {
    let filter = {
      timespan: selectedTimespan,
      from: timespanFrom,
      to: timespanTo
    };

    filterLabel = toFilterLabel(filter);

    applyFilter(filter);
  }

  function resetTimespan() {
    switch (selectedTimespan) {
      case "year":
        timespanFrom = moment().startOf("year");
        timespanTo = moment().endOf("year");
        break;
      case "month":
        timespanFrom = moment().startOf("month");
        timespanTo = moment().endOf("month");
        break;
    }

    updateFilter();
  }

  function moveTimespan(diffToMove) {
    switch (selectedTimespan) {
      case "year":
        timespanFrom = timespanFrom.add(diffToMove, "years");
        timespanTo = timespanTo.add(diffToMove, "years");
        break;
      case "month":
        timespanFrom = timespanFrom.add(diffToMove, "months");
        timespanTo = timespanTo.add(diffToMove, "months");
        break;
    }
    updateFilter();
  }

  function previousTimespan() {
    moveTimespan(-1);
  }

  function nextTimespan() {
    moveTimespan(1);
  }

  function initFilter() {
    let storedFilter = $filterStore;

    selectedTimespan = storedFilter.timespan;
    timespanFrom = storedFilter.from;
    timespanTo = storedFilter.to;

    updateFilter();
  }

  initFilter();
</script>

<style>

</style>

<div class="columns is-multiline">
  <div class="column is-3">
    <div class="select">
      <select bind:value={selectedTimespan} on:change={resetTimespan}>
        <option value="month">Month</option>
        <option value="year">Year</option>
      </select>
    </div>

    <div class="button" on:click={previousTimespan}>
      <span class="icon is-medium">
        <i class="fa fa-angle-left" />
      </span>
    </div>

    <div class="button" on:click={resetTimespan}>
      <span class="icon is-medium">
        <i class="fa fa-home" />
      </span>
    </div>

    <div class="button" on:click={nextTimespan}>
      <span class="icon is-medium">
        <i class="fa fa-angle-right" />
      </span>
    </div>
  </div>
  <div class="column is-3">
    <fieldset disabled>
      <div class="control">
        <input
          class="input"
          type="text"
          placeholder=""
          bind:value={filterLabel} />
      </div>
    </fieldset>
  </div>
  <div class="column is-12">
    {#if $filteredActivitiesStore.length > 1}
      <table class="table is-striped is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Project</th>
            <th>Date</th>
            <th>Start</th>
            <th>End</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th />
            <th />
            <th />
            <th />
            <th align="right">Total: {formatDuration($totalDurationStore)}</th>
          </tr>
        </tfoot>
        <tbody>
          {#each $filteredActivitiesStore as activity}
            <tr title={activity.description}>
              <td>{activity.project.name}</td>
              <td>{activity.startTime.format('DD.MM.YYYY')}</td>
              <td>{activity.startTime.format('HH:mm')}</td>
              <td>{activity.endTime.format('HH:mm')}</td>
              <td align="right">
                {asFormattedDuration(activity.startTime, activity.endTime)}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <div class="notification is-info">No activities in this period.</div>
    {/if}

  </div>
</div>
