import { Link } from 'react-router-dom';
import { Container, Header, Segment, Image, Button } from 'semantic-ui-react';


export default function HomePage() {

    return(
        <Segment vertical textAlign='center' className='masterhead'>
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='/assets/logo.png' style={{marginBottom: 12}}>

                    </Image>
                </Header>
                <Header as='h2' inverted content='Welcome to the Eventag!' />
                <Button as={ Link } to='/activities' inverted size='huge'>
                    Take me to the Activities!
                </Button>
            </Container>
        </Segment>
    )
}