import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Container, Header, Segment, Image, Button } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import LoginForm from '../users/LoginForm';
import RegisterForm from '../users/RegisterForm';


function HomePage() {

    const { userStore, modalStore } = useStore();


    return (
        <Segment vertical textAlign='center' className='masterhead'>
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='/assets/logo.png' style={{marginBottom: 12}}>

                    </Image>
                </Header>
                {userStore.isLoggedIn ? 
                    (
                        <>
                         <Header as='h2' inverted content='Welcome to the Eventag!' />
                         <Button as={ Link } to='/activities' inverted size='huge'>
                            Go to activities
                         </Button>
                        </>
                        
                    ) : (
                        <>
                        <Button 
                         onClick={() => modalStore.openModal(<LoginForm />)}
                         inverted 
                         size='huge'
                        >
                            Login
                        </Button>
                        <Button 
                         onClick={() => modalStore.openModal(<RegisterForm />)}
                         inverted 
                         size='huge'
                        >
                            Register
                        </Button>
                        </>
                    )
                }
            </Container>
        </Segment>
    )
};


export default observer(HomePage);