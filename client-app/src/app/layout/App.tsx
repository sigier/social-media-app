import React, { useEffect, useState, Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {
  
  const [activities, setActivities] = useState<Activity[]>([]);

  const [selectedActivity, setSelectedActivity] = 
                                      useState<Activity | undefined>(undefined); 
  
  const [editMode, setEditMode] = useState(false);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {

    agent.activities.list().then(response => { 

      let activities: Activity[] = [];

      response.forEach(activity => {

        activity.date = activity.date.split('T')[0];

        activities.push(activity);
      });

      setActivities(activities);

      setLoading(false);
    })
  }, []);


  function handleSelectedActivity(id: string) {

    setSelectedActivity(activities.find(activity => activity.id===id));
  }


  function handleCancelActivitySelection() {

    setSelectedActivity(undefined);
  }


  function handleFormOpening(id?: string) {

    id ? handleSelectedActivity(id) : handleCancelActivitySelection();
    
    setEditMode(true);
  }

  function handleFormClosing() {

    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity) {

    setSubmitting(true);

    if (activity.id) {

      agent.activities.update(activity).then(() => {

        setActivities([...activities.filter(x => x.id !== activity.id), activity]);
      });
    } else {
      
      activity.id = uuid();

      agent.activities.create(activity).then(() => {

        setActivities([...activities, activity]);
      });
    }

    
    setSelectedActivity(activity);

    setEditMode(false);

    setSubmitting(false);
    
   
  }

  function handleDeleteActivity (id: string) {

    setSubmitting(true);

    agent.activities.delete(id).then(() => {

      setActivities([...activities.filter(x => x.id !== id)]);

      setSubmitting(false);
    });
  }

  if (loading) {

    return <LoadingComponent content='Loading app' />;
  }


  return (
    <Fragment>
     <NavBar openForm={ handleFormOpening}/>
     <Container style={{marginTop: '7em'}}>
      <ActivityDashboard
       activities={ activities }
       chosenActivity={ selectedActivity }
       selectActivity={ handleSelectedActivity }
       cancelActivitySelection={ handleCancelActivitySelection }
       editMode={ editMode }
       openForm={ handleFormOpening}
       closeForm={ handleFormClosing }
       createOrEdit={ handleCreateOrEditActivity }
       deleteActivity={ handleDeleteActivity }
       submitting={ submitting }
      />
     </Container> 
    </Fragment>
  );
}

export default App;
