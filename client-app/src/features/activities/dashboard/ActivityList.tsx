import React, { SyntheticEvent } from 'react';
import { useState } from 'react';
import { Button, Item, ItemDescription, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props {
    activities: Activity[];
    selectActivity: (id: string) => void;
    deleteActivity: (id: string) => void;
    submitting: boolean;
}

export default function ActivityList(
    {activities, 
     selectActivity, 
     deleteActivity,
     submitting
    }: Props) {

   const [target, setTarget] = useState('');


    function handleDeleteActivity(event: SyntheticEvent<HTMLButtonElement>, id: string) {

        setTarget(event.currentTarget.name);

        deleteActivity(id);
    }
 

    return (
        <Segment>
            <Item.Group divided>
              {
                  activities.map(
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
                                       onClick={ () => selectActivity(activity.id) }
                                    />
                                    <Button 
                                       name={activity.id}
                                       floated='right' 
                                       content='Delete'
                                       color='red'
                                       onClick={ (event) => handleDeleteActivity(event, activity.id) }
                                       loading={ submitting  && target === activity.id}
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