<script>
  import moment from "moment/src/moment";
  import {
    filterStore,
    filteredActivitiesStore,
    totalDurationStore,
    applyFilter
  } from "./stores.js";
  import {
    formatDuration,
    asFormattedDuration,
    asFilterLabel
  } from "./formatter.js";

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

    filterLabel = asFilterLabel(filter);

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
  <div class="column is-4">
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

  <div class="column is-3 is-hidden-mobile">
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

  {#if $filteredActivitiesStore.length > 0}
    {#each $filteredActivitiesStore as activity}
      <div class="column is-12 is-hidden-desktop">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">
              {activity.startTime.format('DD.MM.YYYY')}
            </p>
          </header>
          <div class="card-content">
            <div class="content">
              <div class="columns is-mobile">
                <div class="column is-4">{activity.project.name}</div>
                <div class="column is-5">
                  {activity.startTime.format('HH:mm')} - {activity.endTime.format('HH:mm')}
                </div>
                <div class="column is-3">
                  {asFormattedDuration(activity.startTime, activity.endTime)} h
                </div>
              </div>
            </div>
          </div>
          <!--
          <footer class="card-footer">
            <a href="#" class="card-footer-item">Save</a>
          </footer>
          -->
        </div>
      </div>
    {/each}
    <div class="column is-12 is-hidden-desktop">
      <div class="card">
        <header class="card-header">
          <div class="card-header-title columns is-mobile">
            <div class="column is-6" />
            <div class="column is-3">Total:</div>
            <div class="column is-3">
              {formatDuration($totalDurationStore)} h
            </div>
          </div>
        </header>
        <!--
          <footer class="card-footer">
            <a href="#" class="card-footer-item">Save</a>
          </footer>
          -->
      </div>
    </div>

    <div class="column is-12 is-hidden-mobile">
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
    </div>
  {:else}
    <div class="column is-12">
      <span>No activities in this period.</span>
    </div>
  {/if}

</div>
