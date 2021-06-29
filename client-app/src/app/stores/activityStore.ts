import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";


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


    get groupedActivities() {
        return Object.entries(

            this.activitiesByDate.reduce((activities, activity) => {
                const date = activity.date;
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as {[key: string]: Activity[]})
        )
    }


    loadActivity = async (id: string) => {

        let activity = this.getActivity(id);

        if (activity) {

            this.chosenActivity = activity;

            return activity;

        } else {

            this.loadingInitial = true;

            try {

                activity = await agent.activities.activityDetails(id);

                this.setActivity(activity);

                runInAction(() => {

                    this.chosenActivity = activity;
                });

                this.setLoadingInitial(false);

                return activity;
                
            } catch (error) {

                console.log(error);

                this.setLoadingInitial(false);
            }
        }
    }


    private getActivity(id: string) {

        return this.activityRegister.get(id);
    }


    private setActivity(activity: Activity) {

        activity.date = activity.date.split('T')[0];
        
        this.activityRegister.set(activity.id, activity);
    }   


    loadActivities = async () => {

         this.loadingInitial = true;

         try {

            const activities = await agent.activities.list();

            runInAction(() => {
                
                activities.forEach(activity => {

                    this.setActivity(activity);
                });

                this.loadingInitial = false;
            });
        }
        catch(error) {

            console.log(error);

            runInAction(() => { this.loadingInitial = false; });
        }
    };


    setLoadingInitial = (state: boolean) => {

        this.loadingInitial = state;
    }


    createActivity = async (activity: Activity) => {

        this.loading = true;

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