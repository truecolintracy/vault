import React, { Component } from 'react'
import { Box, Button, Text } from 'grommet'
import { Schedule, Monitor, Services, CirclePlay, AddCircle, Notes } from 'grommet-icons'

class QuickLinks extends Component {
    render() {
        return( 
            <Box
                direction='row'
                border={false}
                background='brand'
                overflow='hidden'
                style={{ width: 'auto', display: 'inline-block' }}
                round={{ size: '10px', corner: 'bottom-right' }}
            >   
                <Box style={{ display: 'inline-block' }}>
                    <Button hoverIndicator fill> 
                        <Box justify='center' align='center' pad='20px'>
                            <Schedule size='medium' />
                            <Text size='xsmall'>Request Off</Text>
                        </Box>
                    </Button>
                </Box>
                <Box style={{ display: 'inline-block' }}>
                    <Button hoverIndicator fill> 
                        <Box justify='center' align='center' pad='20px'>
                            <Monitor size='medium' />
                            <Text size='xsmall'>Helpdesk</Text>
                        </Box>
                    </Button>
                </Box>
                <Box style={{ display: 'inline-block' }}>
                    <Button hoverIndicator fill> 
                        <Box justify='center' align='center' pad='20px'>
                            <Services size='medium' />
                            <Text size='xsmall'>Maintenance</Text>
                        </Box>
                    </Button>
                </Box>
                <Box style={{ display: 'inline-block' }}>
                    <Button hoverIndicator fill> 
                        <Box justify='center' align='center' pad='20px'>
                            <CirclePlay size='medium' />
                            <Text size='xsmall'>Media Request</Text>
                        </Box>
                    </Button>
                </Box>
                <Box style={{ display: 'inline-block' }}>
                    <Button hoverIndicator fill> 
                        <Box justify='center' align='center' pad='20px'>
                            <AddCircle size='medium' />
                            <Text size='xsmall'>Submit Points</Text>
                        </Box>
                    </Button>
                </Box>
                <Box style={{ display: 'inline-block' }}>
                    <Button hoverIndicator fill> 
                        <Box justify='center' align='center' pad='20px'>
                            <Notes size='medium' />
                            <Text size='xsmall'>Company Notes</Text>
                        </Box>
                    </Button>
                </Box>
            </Box>
        )
    }
}

export default QuickLinks