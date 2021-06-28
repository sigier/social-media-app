import { action, makeAutoObservable, observable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { v4 as uuid } from 'uuid';


export default class ActivityStore {
    
    activityRegister = new Map<string, Activity>();

    chosenActivity: Activity | undefined = undefined;

    editMode = false;

    loading = false;

    loadingInitial = true;

    
    constructor() {

        makeAutoObservable(this);
    }


    get activitiesByDate(){

        return Array.from(this.activityRegister.values()).sort((a,b) => 

            Date.parse(a.date) - Date.parse(b.date)
        );
    }

    loadActivities = async () => {

         try {

            const activities = await agent.activities.list();

            runInAction(() => {
                
                activities.forEach(activity => {

                activity.date = activity.date.split('T')[0];
        
                this.activityRegister.set(activity.id, activity);
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

        this.chosenActivity = this.activityRegister.get(id);
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

                this.activityRegister.set(activity.id, activity);

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

                this.activityRegister.set(activity.id, activity);
                
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


    deleteActivity = async(id: string) => {

        
        this.loading = true;

        try {

            await agent.activities.delete(id);

            runInAction(() => {

                this.activityRegister.delete(id);

                if (this.chosenActivity?.id===id) {

                    this.cancelSelectedActivity();
                }

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