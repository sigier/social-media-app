import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Item, ItemDescription, Label, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
 

function ActivityList() {

   const { activityStore } = useStore();

   const { deleteActivity, activitiesByDate, loading } = activityStore;

   const [target, setTarget] = useState('');


    function handleDeleteActivity(event: SyntheticEvent<HTMLButtonElement>, id: string) {

        setTarget(event.currentTarget.name);

        deleteActivity(id);
    }


    return (
        <Segment>
            <Item.Group divided>
              {
                  activitiesByDate.map(
                      activity => (
                          <Item key={activity.id}>
                              <Item.Content>
                                  <Item.Header as='a'>
                                    { activity.title }
                                  </Item.Header>
                                  <Item.Meta>
                                    { activity.date }
                                  </Item.Meta>
                                  <Item.Description>
                                      <div>{ activity.description }</div>
                                      <div>
                                          { activity.city }, 
                                          { activity.venue }
                                      </div>
                                  </Item.Description>
                                  <Item.Extra>
                                    <Button 
                                       floated='right' 
                                       content='View'
                                       color='blue'
                                       as= { Link } to={`/activities/${activity.id}`}
                                    />
                                    <Button 
                                       name={activity.id}
                                       floated='right' 
                                       content='Delete'
                                       color='red'
                                       onClick={ (event) => handleDeleteActivity(event, activity.id) }
                                       loading={ loading  && target === activity.id}
                                    />
                                    <Label
                                     basic
                                     content={activity.category}
                                    /> 
                                  </Item.Extra>
                              </Item.Content>
                          </Item>
                      )
                  )
              }  
            </Item.Group>
        </Segment>
    )
};


export default observer(ActivityList);