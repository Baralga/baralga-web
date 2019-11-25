<script>
  import FileSaver from "file-saver/src/FileSaver";
  import { filteredActivitiesStore, toFilterLabel } from "./stores.js";

  const CSV_HEADER = ["Date", "Start", "End", "Project", "Description"]
    .join(";")
    .concat("\n");

  function exportCsv() {
    let activities = $filteredActivitiesStore.map(activity => {
      return [
        activity.startTime.format("DD.MM.YYYY"),
        activity.startTime.format("HH:mm"),
        activity.endTime.format("HH:mm"),
        activity.project.name,
        activity.description
      ]
        .join(";")
        .concat("\n");
    });

    let blob = new Blob([CSV_HEADER, ...activities], {
      type: "text/csv;charset=utf-8"
    });
    FileSaver.saveAs(blob, "Activities-" + toFilterLabel() + ".csv");
  }
</script>

<p class="control">
  <span class="button is-link" on:click={exportCsv}>
    <span class="icon">
      <i class="fas fa-file-csv"></i>
    </span>
    <span>Export as <abbr title="Comma Separated Values">CSV</abbr></span>
  </span>
</p>
