import { action, makeAutoObservable, observable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { v4 as uuid } from 'uuid';


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


    createActivity = async (activity: Activity) => {

        this.loading = true;

        activity.id = uuid();

        try {

            await agent.activities.create(activity);

            runInAction(() => {

                this.activities.push(activity);

                this.chosenActivity = activity;

                this.editMode = false;

                this.loading = false;
            });

        } catch (error) {

            console.log(error);

            runInAction(() => {

                this.loading = false;
            });
        }
    };


    updateActivity = async (activity: Activity) => {

        this.loading = true;

        try {

            await agent.activities.update(activity);

            runInAction(() => {

                this.activities = 
                    [...this.activities.filter(x => x.id !== activity.id), activity];
                
                this.chosenActivity = activity;

                this.editMode = false;

                this.loading = false;
            });
            
        } catch (error) {

            console.log(error);
            
            runInAction(() => {
                
                this.loading = false;
            });
        }
    };
};