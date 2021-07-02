import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Header } from "semantic-ui-react";
import ReuseTextInput from "../../app/common/form/ReuseTextInput";
import { useStore } from "../../app/stores/store";
import * as Yup from 'yup';
import ValidationErrors from "../errors/ValidationErrors";


function RegisterForm() {

    const {userStore} = useStore();

    return (
        <Formik
         initialValues={{
                displayName: '', 
                username: '',
                email: '', 
                password: '', 
                error: null
         }}
         validationSchema={Yup.object({
            displayName: Yup.string().required(),
            username: Yup.string().required(),
            email: Yup.string().required().email(),
            password: Yup.string().required(),
         })}
         onSubmit={
          (values, {setErrors}) => userStore.register(values).catch(error =>
            setErrors({error})
            )
         }
        >
            {({handleSubmit, isSubmitting, errors, isValid, dirty}) => (
                <Form 
                 className='ui form error' 
                 onSubmit={handleSubmit}
                 autoComplete='off'
                >
                    <Header 
                     as='h2' 
                     content='Sign Up to activities' 
                     color='teal' 
                     textAlign='center'
                    />
                    <ReuseTextInput name='displayName' placeholder='Display name' />
                    <ReuseTextInput name='username' placeholder='User Name' />
                    <ReuseTextInput name='email' placeholder='Email' />
                    <ReuseTextInput name='password' placeholder='password' type='password' />
                    <ErrorMessage 
                     name='error'
                     render = {
                        () => <ValidationErrors errors={errors.error}/>
                    }
                    />
                    <Button 
                     positive 
                     fluid 
                     content='Register' 
                     type='submit'
                     loading={isSubmitting} 
                     disabled={ !dirty || !isValid || isSubmitting }
                    />
                </Form>
            )}
        </Formik>
    )
};


export default observer(RegisterForm);