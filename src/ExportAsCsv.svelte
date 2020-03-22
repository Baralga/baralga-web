<script>
  import FileSaver from "file-saver/src/FileSaver";
  import { filteredActivitiesStore, filterStore } from "./stores.js";
  import { asFilterLabel, asFormattedDuration } from "./formatter.js";

  const CSV_HEADER = [
    "Date",
    "Start",
    "End",
    "Duration",
    "Project",
    "Description"
  ]
    .join(";")
    .concat("\n");

  function exportCsv() {
    let activities = $filteredActivitiesStore.map(activity => {
      return [
        activity.startTime.format("DD.MM.YYYY"),
        activity.startTime.format("HH:mm"),
        activity.endTime.format("HH:mm"),
        asFormattedDuration(activity.startTime, activity.endTime),
        activity.project.name,
        activity.description
      ]
        .join(";")
        .concat("\n");
    });

    let blob = new Blob([CSV_HEADER, ...activities], {
      type: "text/csv;charset=utf-8"
    });
    FileSaver.saveAs(
      blob,
      "Activities-" + asFilterLabel($filterStore) + ".csv"
    );
  }
</script>

<button class="button is-link is-hidden-mobile" on:click={exportCsv}>
  <span class="icon">
    <i class="fas fa-file-csv" />
  </span>
  <span>
    Export as
    <abbr title="Comma Separated Values">CSV</abbr>
  </span>
</button>

<button class="button is-link is-hidden-desktop" on:click={exportCsv}>
  <span class="icon">
    <i class="fas fa-file-csv" />
  </span>
</button>
