import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import {  useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ReuseTextInput from '../../../app/common/form/ReuseTextInput';
import ReuseTextArea from '../../../app/common/form/ReuseTextArea';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import ReuseSelectInput from '../../../app/common/form/ReuseSelectInput';
import ReuseDateInput from '../../../app/common/form/ReuseDateInput';
import { Activity, ActivityFormValues } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import { act } from 'react-dom/test-utils';



function ActivityForm() {

    const { activityStore } = useStore();

    const history = useHistory();

    const { createActivity, 
        updateActivity, 
        loading,
        loadActivity,
        loadingInitial
      } = activityStore;


    const validationSchema = Yup.object({
        title: Yup.string().required('Activity title is mandatory'),
        description: Yup.string().required('Activity description is mandatory'),
        category: Yup.string().required(),
        date: Yup.string().required('Date is required').nullable(),
        city: Yup.string().required(),
        venue: Yup.string().required()
    })


    const [activity, setActivity] = 
            useState<ActivityFormValues>(new ActivityFormValues());


    const { id } = useParams<{ id: string }>();


    useEffect(() => {

        if (id) {

            loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)));
        }

    }, [id, loadActivity]);


    function handleFormSubmit(activity: ActivityFormValues) {
        if (!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`))
        } else {
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`))
        }
    }


    if (loadingInitial) return <LoadingComponent content='Loading activity...' />;


    return (
        <Segment clearing>
            <Header content='Activity details' sub color='teal' />
            <Formik
             validationSchema={validationSchema} 
             enableReinitialize 
             initialValues={activity} 
             onSubmit={values => handleFormSubmit(values)}>
                {
                    ({ handleSubmit, isValid, isSubmitting, dirty }) => (

                        <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                            <ReuseTextInput
                             name='title'
                             placeholder='Title' 
                            />
                            <ReuseTextArea rows={4}
                                placeholder='Description'
                                name='description'
                            />
                            <ReuseSelectInput options={categoryOptions}
                                placeholder='Category'
                                name='category'
                            />
                            <ReuseDateInput
                                placeholderText='Date'
                                name='date'
                                showTimeSelect
                                timeCaption='time'
                                dateFormat='MMMM d, yyyy h:mm a'
                            />
                            <Header content='Location details' sub color='teal' />
                            <ReuseTextInput
                                placeholder='City'
                                name='city'
                            />
                            <ReuseTextInput
                                placeholder='Venue'
                                name='venue'
                            />
                            <Button
                                floated='right'
                                positive
                                type='submit'
                                content='Sumbit'
                                loading={isSubmitting}
                            />
                            <Button
                                disabled={isSubmitting || !isValid || !dirty }
                                floated='right'
                                type='button'
                                content='Cancel'
                                as={Link} to='/activities'
                            />
                        </Form>
                    )
                }
            </Formik>
        </Segment>
    )
};


export default observer(ActivityForm);