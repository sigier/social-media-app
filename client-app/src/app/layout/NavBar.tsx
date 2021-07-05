import { observer } from 'mobx-react-lite';
import { Link, NavLink } from 'react-router-dom';
import { Container, Menu, Button, Image, Dropdown } from 'semantic-ui-react';
import { useStore } from '../stores/store';


function NavBar() {

    const { userStore: {user, logout} } = useStore();


    return (
        
     <Menu inverted fixed='top'>
         <Container>
             <Menu.Item  as={ NavLink } to='/' exact header>
                 <img src="/assets/logo.png" alt="logo" style={{marginRight:'10px'}} />
                 Eventum
             </Menu.Item>
             <Menu.Item as={ NavLink } to='/activities' name='Activities' />
             <Menu.Item>
                 <Button
                  positive
                  content='Create activity'
                  as={ NavLink } to='/new'
                 />
              </Menu.Item>
              <Menu.Item
               position='right'
              >
                  <Image
                   src={ user?.image || '/assets/user.png' } 
                   avatar
                   spaced='right'
                  />
                  <Dropdown
                   pointing='top left' 
                   text={ user?.displayName }
                  >
                    <Dropdown.Menu>
                      <Dropdown.Item 
                       as={ Link }
                       to={`/profiles/${user?.username}`}
                       text='My Profile'
                       icon='user'
                      />
                      <Dropdown.Item 
                       onClick={ logout }
                       text='Logout'
                       icon='power'
                      />
                    </Dropdown.Menu>  
                  </Dropdown>
              </Menu.Item>
         </Container>
     </Menu>   
    )
};


export default observer(NavBar);