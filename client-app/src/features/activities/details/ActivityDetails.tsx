import { observer } from 'mobx-react-lite';
import React from 'react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, Image } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';


function ActivityDetails() {

    const { activityStore } = useStore();

    const { chosenActivity: activity, loadActivity, loadingInitial } = activityStore;

    const { id } = useParams<{id: string}>();


    useEffect(() =>{

        if (id) {

            loadActivity(id);
        }

    }, [id, loadActivity]);


    if (loadingInitial || !activity) return <LoadingComponent />;


    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
            <Card.Content>
                <Card.Header>{ activity.title }</Card.Header>
                <Card.Meta>
                    <span>{ activity.date }</span>
                </Card.Meta>
                <Card.Description>
                    { activity.description }
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group width='2'>
                    <Button
                     basic
                     color='blue'
                     content='Edit'
                     as={ Link } to={`/manage/${activity.id}`}
                    />
                    <Button
                     basic
                     color='grey'
                     content='Cancel'
                     as={ Link } to='/activities'
                    />
                </Button.Group>
            </Card.Content>
        </Card>
    )
};


export default observer(ActivityDetails);