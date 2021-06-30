import { Link } from "react-router-dom";
import { Button, Header, Icon, Segment } from "semantic-ui-react";


export default function NotFound() {

    return (
        <Segment>
            <Header icon>
                <Icon name='search'></Icon>
                Oops! We've looked everywhere and could not find it!
            </Header>
            <Segment.Inline>
                <Button as={Link} to='/activities' primary>
                    Return to the activities page
                </Button>
            </Segment.Inline>
        </Segment>
    )
};