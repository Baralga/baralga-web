<script>
  import moment from "moment/src/moment";
  import { activitiesStore, totalDuration, totalDurationStore } from "./stores.js";
  import { formatDuration, asFormattedDuration } from "./formatter.js";
</script>

<style>

</style>

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
    {#each $activitiesStore as activity}
      <tr title="{activity.description}">
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
