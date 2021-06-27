import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { Header, List, Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

function App() {
  
  const [activities, setActivities] = useState<Activity[]>([]);

  const [selectedActivity, setSelectedActivity] = 
                                      useState<Activity | undefined>(undefined); 
  
  const [editMode, setEditMode] = useState(false);


  useEffect(() => {

    axios.
    get<Activity[]>('http://localhost:5000/api/activities').
    then(response => { setActivities(response.data); })
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
      />
     </Container> 
    </Fragment>
  );
}

export default App;
