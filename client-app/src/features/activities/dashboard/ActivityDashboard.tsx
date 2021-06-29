import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';


function ActivityDashboard() {

    const { activityStore } = useStore();

    const { loadActivities, activityRegister } = activityStore;

    
    useEffect(() => {

        if (activityRegister.size <= 1) {
            
            loadActivities();
        }

    }, [activityRegister.size, loadActivities]);
 

    if (activityStore.loadingInitial) {

        return <LoadingComponent content='Loading app' />;
    }


    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilters />
            </Grid.Column>
        </Grid>
    )
};


export default observer(ActivityDashboard);