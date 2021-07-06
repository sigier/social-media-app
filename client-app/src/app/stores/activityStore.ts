import format from "date-fns/format";
import { makeAutoObservable, reaction } from "mobx";
import { runInAction } from "mobx";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import { Pagination, PagingParams } from "../models/pagination";
import { Profile } from "../models/profile";
import { store } from "./store";


export default class ActivityStore {
    
    activityRegister = new Map<string, Activity>();

    chosenActivity: Activity | undefined = undefined;

    editMode = false;

    loading = false;

    loadingInitial = false;

    pagination: Pagination | null = null;

    pagingParams = new PagingParams();

    predicate = new Map().set('all', true);

    
    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () => {
                this.pagingParams = new PagingParams();
                this.activityRegister.clear();
                this.loadActivities();
            }
        )
    }

    setPagingParams = (pagingParams: PagingParams) => {

        this.pagingParams = pagingParams;
    }

    setPredicate = (predicate: string, value: string | Date) => {

        const resetPredicate = () => {

            this.predicate.forEach((value, key) => {

                if (key === 'startDate') {

                    this.predicate.delete(key);
                }
            });
        };

        switch(predicate) {
            case "all":
                resetPredicate();
                this.predicate.set("all", true);
                break;
            case "isGoing":
                resetPredicate();
                this.predicate.set("isGoing", true);
                break;
            case "isHost":
                resetPredicate();
                this.predicate.set("isHost", true);
                break;
            case "startDate":
                this.predicate.delete("startDate")
                this.predicate.set("startDate", value)
                break;
        }
    };

    get axiosParams() {

        const params = new URLSearchParams();

        params.append('pageNumber', this.pagingParams.pageNumber.toString());

        params.append('pageSize', this.pagingParams.pageSize.toString());

        this.predicate.forEach((value, key) => {

            if (key === 'startDate') {
                params.append(key, (value as Date).toISOString())
            } else {
                params.append(key, value);
            }
        })

        return params;
    }


    get activitiesByDate(){

        return Array.from(this.activityRegister.values()).sort((a,b) => 

            (a.date!.getTime()) - (b.date!.getTime())
        );
    }


    get groupedActivities() {
        return Object.entries(

            this.activitiesByDate.reduce((activities, activity) => {

                const date = format(activity.date!, 'dd MMM yyyy');
                
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                
                return activities;

            }, {} as {[key: string]: Activity[]})
        )
    };


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

        const user = store.userStore.user;

        if (user) {
            
            activity.isGoing = activity.attendees!.some(
                a => a.username === user.username
            );

            activity.isHost = activity.hostUsername === user.username;

            activity.host = activity.attendees?.find (

                x => x.username === activity.hostUsername
            );
        }


        activity.date = new Date(activity.date!);
        
        this.activityRegister.set(activity.id, activity);
    }   


    loadActivities = async () => {

        this.loadingInitial = true;

        try {
            const result = await agent.activities.list(this.axiosParams);

            result.data.forEach(activity => {

                this.setActivity(activity);

            });

            this.setPagination(result.pagination);

            this.setLoadingInitial(false);

        } catch (error) {

            console.log(error);
            
            this.setLoadingInitial(false);
        }
    }


    setLoadingInitial = (state: boolean) => {

        this.loadingInitial = state;
    }


    setPagination = (pagination: Pagination) => {

        this.pagination = pagination;
    };


    createActivity = async (activity: ActivityFormValues) => {

        const user = store.userStore.user;

        const attendee = new Profile(user!);

        try {

            await agent.activities.create(activity);

            const newActivity = new Activity(activity);

            newActivity.hostUsername = user!.username;

            newActivity.attendees = [attendee];

            this.setActivity(newActivity);

            runInAction(() => {

                this.chosenActivity = newActivity;

            });

        } catch (error) {

            console.log(error);

        }
    };


    updateActivity = async (activity: ActivityFormValues) => {

        try {

            await agent.activities.update(activity);

            runInAction(() => {
                if (activity.id) {

                    let updatedActivity = {...this.getActivity(activity.id),...activity};

                    this.activityRegister.set(activity.id, updatedActivity as Activity);

                    this.chosenActivity = updatedActivity as Activity;
                }
            });
 
        } catch (error) {

            console.log(error);
            
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


    updateAttendance = async() => {

        const user = store.userStore.user;

        this.loading = true;

        try {

            await agent.activities.attend(this.chosenActivity?.id!)

            runInAction(() => {
                
                if (this.chosenActivity?.isGoing) {

                    this.chosenActivity.attendees = 
                        this.chosenActivity.attendees?.filter(
                            a => a.username !== user?.username
                        );
                    
                    this.chosenActivity.isGoing = false;

                } else {

                    const attendee = new Profile(user!);

                    this.chosenActivity?.attendees?.push(attendee);

                    this.chosenActivity!.isGoing = true;
                }

                this.activityRegister.set(this.chosenActivity!.id, this.chosenActivity!);
            });
            
        } catch (error) {

            console.log(error);
            
        } finally {

            runInAction(() => this.loading = false);
        }
    };


    cancelActivityToggle = async () => {

        this.loading = true;

        try {

            await agent.activities.attend(this.chosenActivity!.id);

            runInAction(() => {

                this.chosenActivity!.isCancelled = !this.chosenActivity!.isCancelled;

                this.activityRegister.set(this.chosenActivity!.id, this.chosenActivity!);
            });
            
        } catch (error) {

            console.log(error);
        
        } finally {

            runInAction(() => this.loading = false);
        }

    };


    clearChosenActivity = () => {
        
        this.chosenActivity = undefined;
    };


    updateAttendeeFollowing = (username: string) => {

        this.activityRegister.forEach(activity => {
            activity.attendees.forEach(attendee => {
                if (attendee.username === username){

                    attendee.following ? 
                    attendee.followersCount-- :
                    attendee.followersCount++;

                    attendee.following = !attendee.following;
                }
            })
        });
    };
};