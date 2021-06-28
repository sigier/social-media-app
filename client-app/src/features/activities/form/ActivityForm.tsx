import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';


function ActivityForm() {
    
    const { activityStore } = useStore();

    const { chosenActivity, 
            closeForm, 
            createActivity, 
            updateActivity, 
            loading
          } = activityStore;

    const initialState = chosenActivity ?? {

        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    }; 

    const [activity, setActivity] = useState(initialState); 

    function handleSubmit() {

        activity.id ? updateActivity(activity) : createActivity(activity);
     }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        
        const { name, value } = event.target;

        setActivity({...activity, [name]: value});
    }

    return (
        <Segment clearing>
            <Form onSubmit={ handleSubmit } autoComplete='off'>
                <Form.Input 
                 placeholder='Title' 
                 value={activity.title} 
                 name='title' 
                 onChange={ handleInputChange }
                />
                <Form.TextArea 
                 placeholder='Description'
                 value={activity.description} 
                 name='description' 
                 onChange={ handleInputChange }                 
                />
                <Form.Input 
                 placeholder='Category'
                 value={activity.category} 
                 name='category' 
                 onChange={ handleInputChange } 
                />
                <Form.Input
                 placeholder='Date'
                 type='date' 
                 value={activity.date} 
                 name='date' 
                 onChange={ handleInputChange }
                />
                <Form.Input
                 placeholder='City'
                 value={activity.city} 
                 name='city' 
                 onChange={ handleInputChange } 
                />
                <Form.Input
                 placeholder='Venue'
                 value={activity.venue} 
                 name='venue' 
                 onChange={ handleInputChange } 
                />
                <Button 
                 floated='right'
                 positive 
                 type='submit'
                 content='Sumbit' 
                 loading={ loading }
                />
                <Button 
                 floated='right'
                 type='button'
                 content='Cancel' 
                 onClick={ closeForm }
                />
            </Form>
        </Segment>
    )
};


export default observer(ActivityForm);