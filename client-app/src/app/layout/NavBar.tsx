import { NavLink } from 'react-router-dom';
import { Container, Menu, Button } from 'semantic-ui-react';


export default function NavBar() {

    return (
     <Menu inverted fixed='top'>
         <Container>
             <Menu.Item  as={ NavLink } to='/' exact header>
                 <img src="/assets/logo.png" alt="logo" style={{marginRight:'10px'}} />
                 Reactivities
             </Menu.Item>
             <Menu.Item as={ NavLink } to='/activities' name='Activities' />
             <Menu.Item>
                 <Button
                  positive
                  content='Create activity'
                  as={ NavLink } to='/new'
                 />
              </Menu.Item>
         </Container>
     </Menu>   
    )
};