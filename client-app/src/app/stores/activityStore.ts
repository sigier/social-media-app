import { action, makeAutoObservable, observable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";


export default class ActivityStore {
    
    activities: Activity[] = [];

    chosenActivity: Activity | undefined = undefined;

    editMode = false;

    loading = false;

    loadingInitial = false;

    
    constructor() {

        makeAutoObservable(this);
    }


    loadActivities = async () => {

        this.loadingInitial = true;

        try {

            const activities = await agent.activities.list();

            runInAction(() => {
                
                activities.forEach(activity => {

                activity.date = activity.date.split('T')[0];
        
                this.activities.push(activity);
                });

                this.loadingInitial = false;
            });
        }
        catch(error) {

            console.log(error);

            runInAction(() => { this.loadingInitial = false; });
        }
    };


    selectActivity = (id: string) => {

        this.chosenActivity = this.activities.find(x => x.id ===id);
    };


    cancelSelectedActivity = () => {

        this.chosenActivity = undefined;
    };


    openForm = (id?: string) => {

        id ?
        this.selectActivity(id) :
        this.cancelSelectedActivity(); 

        this.editMode = true;
    };


    closeForm = () => {
        
        this.editMode = false;
    };
};