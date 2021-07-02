import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Header, Label } from "semantic-ui-react";
import ReuseTextInput from "../../app/common/form/ReuseTextInput";
import { useStore } from "../../app/stores/store";


function LoginForm() {

    const {userStore} = useStore();

    return (
        <Formik
         initialValues={{email: '', password: '', error: null
         }}
         onSubmit={
          (values, {setErrors}) => userStore.login(values).catch(error =>
            setErrors({error: 'Invalid credentials'})
            )
         }
        >
            {({handleSubmit, isSubmitting, errors}) => (
                <Form 
                 className='ui form' 
                 onSubmit={handleSubmit}
                 autoComplete='off'
                >
                    <Header 
                     as='h2' 
                     content='login to the activities' 
                     color='teal' 
                     textAlign='center'
                    />
                    <ReuseTextInput name='email' placeholder='email' />
                    <ReuseTextInput name='password' placeholder='password' type='password' />
                    <ErrorMessage 
                     name='error'
                     render = {
                        () => <Label style={{marginBottom: 10}} basic color='red' content={errors.error}/>
                    }
                    />
                    <Button 
                     positive 
                     fluid 
                     content='Login' 
                     type='submit'
                     loading={isSubmitting} 
                    />
                </Form>
            )}
        </Formik>
    )
};


export default observer(LoginForm);