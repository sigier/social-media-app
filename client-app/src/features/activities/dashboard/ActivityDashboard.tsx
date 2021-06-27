import React from 'react';
import { Grid, List } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

interface Props {
    activities: Activity[];
    chosenActivity: Activity | undefined;
    selectActivity: (id: string) => void;
    cancelActivitySelection: () => void;
    editMode: boolean;
    openForm: (id?: string) => void;
    closeForm: () => void;

}

export default function ActivityDashboard(
    {activities, 
     chosenActivity, 
     selectActivity, 
     cancelActivitySelection,
     editMode,
     openForm,
     closeForm
    }: Props) {

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList
                 activities={ activities }
                 selectActivity={ selectActivity }
                />
            </Grid.Column>
            <Grid.Column width='6'>
                {
                 chosenActivity && !editMode &&
                 <ActivityDetails
                  activity={ chosenActivity } 
                  cancelActivitySelection={ cancelActivitySelection }
                  openForm={ openForm }
                 />
                }
                {
                 editMode &&
                    <ActivityForm closeForm={ closeForm } activity={ chosenActivity }/>
                }
            </Grid.Column>
        </Grid>
    )
};