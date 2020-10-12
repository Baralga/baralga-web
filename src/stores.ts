import * as moment from 'moment/moment.js';
import { writable, get } from "svelte/store";
import shortid from "./shortid";

export class Project {
  id: string;
  name: string;
  description: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

const createWritableStore = (key, startValue, elementInitializer?) => {
  const { subscribe, set } = writable(startValue);

  if (elementInitializer) {
    const json = localStorage.getItem(key);
    if (json) {
      let storedObject = JSON.parse(json);
      set(storedObject);
      if (Array.isArray(storedObject) && elementInitializer) {
        storedObject.map(elementInitializer);
        set(storedObject);
      }
    }
  }

  return {
    subscribe,
    set,
    useLocalStorage: () => {
      const json = localStorage.getItem(key);
      if (json) {
        let storedObject = JSON.parse(json);
        set(storedObject);
        if (Array.isArray(storedObject) && elementInitializer) {
          storedObject.map(elementInitializer);
          set(storedObject);
        } else if (elementInitializer) {
          set(elementInitializer(storedObject));
        }
      }

      subscribe((current) => {
        localStorage.setItem(key, JSON.stringify(current));
      });
    },
  };
};

let projects: Project[] = [new Project(shortid(), "My Project")];

export const projectStore = createWritableStore("projects", projects);
projectStore.useLocalStorage();

const activityInitializer = (activity) => {
  if (!activity.id) {
    activity.id = shortid();
  }
  activity.startTime = moment(activity.startTime);
  activity.endTime = moment(activity.endTime);
  return activity;
};

export const activitiesStore = createWritableStore(
  "activities",
  [],
  activityInitializer
);
activitiesStore.useLocalStorage();

export const deleteProjectValidate = (project: Project) => {
  let dependingActivities = [...get(activitiesStore)].filter(
    (activity) => activity.project.id === project.id
  );
  return {
    project: project,
    dependingActivities: dependingActivities,
    dependingActivitiesCount: dependingActivities.length,
  };
};

export const deleteProject = (project: Project) => {
  let projects = [...get(projectStore)].filter((p) => p.id !== project.id);
  projectStore.set(projects);

  let activities = [...get(activitiesStore)].filter(
    (activity) => activity.project.id !== project.id
  );
  activitiesStore.set(activities);
};

export const addActivity = (activity) => {
  if (!activity.id) {
    activity.id = shortid();
  }
  let activities = [...get(activitiesStore), activity];
  activitiesStore.set(activities);
};

export const updateActivity = (activity) => {
  let activityToUpdate = get(activitiesStore).find((a) => a.id === activity.id);
  if (!activityToUpdate) {
    return;
  }

  let activities = [
    ...get(activitiesStore).filter((a) => a !== activityToUpdate),
    activity,
  ];
  activitiesStore.set(activities);
};

export const getActivity = (id: string) => {
  return get(activitiesStore).find((activity) => activity.id === id);
};

const filterInitializer = (filter) => {
  filter.from = moment(filter.from);
  filter.to = moment(filter.to);
  return filter;
};

export const importBackup = (dataBackup) => {
  projectStore.set(dataBackup.projects);
  activitiesStore.set(dataBackup.activities);
}

export const filteredActivitiesStore = createWritableStore(
  "filteredActivities",
  []
);
let filter = {
  timespan: "year",
  from: moment().startOf("year"),
  to: moment().endOf("year"),
};
export const filterStore = createWritableStore(
  "filter",
  filter,
  filterInitializer
);
filterStore.useLocalStorage();

export const applyFilter = (filter) => {
  let activities = get(activitiesStore)
    .filter((activity) =>
      activity.startTime.isBetween(filter.from, filter.to, null, "[)")
    )
    .sort(
      // Order by start time ascending
      (a, b) => (a.startTime.valueOf() - b.startTime.valueOf()) * -1
    );
  filteredActivitiesStore.set(activities);
  filterStore.set(filter);
};

activitiesStore.subscribe(() => {
  let filter = get(filterStore);
  if (filter != null) {
    applyFilter(filter);
  }
});

export const addProject = (project: Project) => {
  if (!project.id) {
    project.id = shortid();
  }

  let projects = [...get(projectStore), project];
  projectStore.set(projects);
};

export const getProject = (id: string) => {
  return get(projectStore).find((project) => id === project.id);
};

export const totalDuration = () => {
  if (get(filteredActivitiesStore).length == 0) {
    return moment.duration(0);
  }

  let totalDuration = get(filteredActivitiesStore)
    .map((activity) =>
      moment.duration(activity.endTime.diff(activity.startTime))
    )
    .reduce((total, currentValue) => {
      return total.add(currentValue);
    });

  return totalDuration;
};

export const totalDurationStore = writable(totalDuration());

filteredActivitiesStore.subscribe(() => {
  totalDurationStore.set(totalDuration());
});
