import React from 'react';
import { Grid } from 'semantic-ui-react';
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
    createOrEdit: (activity: Activity) => void;

}

export default function ActivityDashboard(
    {activities, 
     chosenActivity, 
     selectActivity, 
     cancelActivitySelection,
     editMode,
     openForm,
     closeForm,
     createOrEdit
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
                    <ActivityForm
                     closeForm={ closeForm } 
                     activity={ chosenActivity }
                     createOrEdit={ createOrEdit }
                    />
                }
            </Grid.Column>
        </Grid>
    )
};