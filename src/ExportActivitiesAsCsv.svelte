<script>
  import FileSaver from "file-saver/src/FileSaver";
  import { filteredActivitiesStore, filterStore } from "./stores";
  import { asFilterLabel } from "./formatter";
  import { createCsv } from "./export_csv";

  function exportCsv() {
    let blob = createCsv($filteredActivitiesStore);
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
