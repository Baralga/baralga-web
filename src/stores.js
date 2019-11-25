import moment from 'moment/src/moment';
import { writable, get } from 'svelte/store';
import shortid from 'shortid/index';

const createWritableStore = (key, startValue, elementInitializer) => {
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

            subscribe(current => {
                localStorage.setItem(key, JSON.stringify(current));
            });
        }
    };
};

let projects = [
    {
        id: shortid.generate(),
        name: 'My Project'
    }
];

export const projectStore = createWritableStore('projects', projects);
projectStore.useLocalStorage();

const activityInitializer = (activity) => {
    activity.startTime = moment(activity.startTime);
    activity.endTime = moment(activity.endTime);
    return activity;
};

export const activitiesStore = createWritableStore('activities', [], activityInitializer);
activitiesStore.useLocalStorage();

export const deleteProject = (project) => {
    let projects = [...get(projectStore)].filter((p) => p.id !== project.id);
    projectStore.set(projects);

    let activities = [...get(activitiesStore)].filter((activity) => activity.project.id !== project.id);
    activitiesStore.set(activities);
}

export const addActivity = (activity) => {
    let activities = [...get(activitiesStore), activity];
    activitiesStore.set(activities);
}

const filterInitializer = (filter) => {
    filter.from = moment(filter.from);
    filter.to = moment(filter.to);
    return filter;
};

export const filteredActivitiesStore = createWritableStore('filteredActivities', []);
let filter = {
    timespan: "year",
    from: moment().startOf("year"),
    to: moment().endOf("year"),
}
export const filterStore = createWritableStore('filter', filter, filterInitializer);
filterStore.useLocalStorage();


export const applyFilter = (filter) => {
    let activities = get(activitiesStore).filter(
        (activity) => activity.startTime.isBetween(filter.from, filter.to, null, '[)')
    );
    filteredActivitiesStore.set(activities);
    filterStore.set(filter)
}

activitiesStore.subscribe(() => {
    let filter = get(filterStore);
    if (filter != null) {
        applyFilter(filter);
    }
});

export const addProject = (project) => {
    if (!project.id) {
        project.id = shortid.generate();
    }

    let projects = [...get(projectStore), project];
    projectStore.set(projects);
}

export const totalDuration = () => {
    if (get(filteredActivitiesStore).length == 0) {
        return moment.duration(0);
    }

    let totalDuration = get(filteredActivitiesStore).map(
        (activity) => moment.duration(activity.endTime.diff(activity.startTime))
    ).reduce((total, currentValue) => {
        return total.add(currentValue);
    });

    return totalDuration;
}

export const toFilterLabel = (filterParam) => {
    filter = (filterParam ? filterParam : get(filterStore));

    switch (filter.timespan) {
        case "year":
            return filter.from.format("YYYY");
        case "month":
            return filter.from.format("YYYY MMMM");
        default:
            return "?";
    };
}

export const totalDurationStore = writable(totalDuration());

filteredActivitiesStore.subscribe(() => {
    totalDurationStore.set(totalDuration());
});
