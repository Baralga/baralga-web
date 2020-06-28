<script>
  import FileSaver from "file-saver/src/FileSaver";
  import { activitiesStore, projectStore } from "./stores.js";
  import { readXml, createXml } from "./xml_backup.js";
  import moment from "moment/src/moment";

  function exportXml() {
    let blob = createXml($activitiesStore, $projectStore);
    FileSaver.saveAs(
      blob,
      "backup_" + moment().format("DD.MM.YYYY") + ".baralga.xml"
    );
  }

  function handleFileSelect(event) {
    let selectedFile = event.target.files[0];
    let isValidBackupFile =
      selectedFile.name.endsWith(".xml") && selectedFile.type === "text/xml";
    if (!isValidBackupFile) {
      console.error("Ignore");
      return;
    }

    let reader = new FileReader();
    reader.readAsText(selectedFile);
    reader.onload = () => {
      let backup = readXml(reader.result)
      console.info(backup)
    };
  }
</script>

<button class="button is-link is-hidden-mobile" on:click={exportXml}>
  <span class="icon">
    <i class="fas fa-file-code" />
  </span>
  <span>
    Export as
    <abbr title="Extensible Markup Language">XML</abbr>
  </span>
</button>

<button class="button is-link is-hidden-desktop" on:click={exportXml}>
  <span class="icon">
    <i class="fas fa-file-code" />
  </span>
</button>

<div class="file">
  <label class="file-label">
    <input
      class="file-input"
      type="file"
      on:change={handleFileSelect}
      name="resume" />
    <span class="file-cta">
      <span class="file-icon">
        <i class="fas fa-upload" />
      </span>
      <span class="file-label">Choose a file…</span>
    </span>
  </label>
</div>
