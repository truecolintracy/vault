import React, { Component } from 'react'
import { Grommet, Box, Button, Grid, Text } from 'grommet'
import { grommet } from "grommet/themes";
// import Link from 'next/link'
// import Head from '../components/head'
// import Nav from '../components/nav'

class Home extends Component {
  state = { sidebar: true };
  
  render() {
    const { sidebar } = this.state
    return (
      <Grommet full theme={grommet}>
        <Grid
          fill
          rows={['auto', 'flex']}
          columns={['auto', 'flex']}
          areas={[
            { name: 'header', start: [0, 0], end: [1, 0] },
            { name: 'sidebar', start: [0, 1], end: [0,1 ] },
            { name: 'main', start: [1, 1], end: [1, 1] }
          ]}
        >
          <Box
            gridArea='header'
            direction='row'
            align='center'
            justify='between'
            pad={{ horizontal: 'medium', vertical: 'small'}}
            background='dark-2'
          >
            <Button onClick={() => this.setState({ sidebar: !sidebar })}>
              <Text size='large'>Title</Text>
            </Button>
            <Text>Testing</Text>
          </Box>
          {sidebar && (
            <Box  
              gridArea='sidebar'
              background='dark-3'
              width='small'
              animation={[
                { type: 'fadeIn', duration: 300 },
                { type: 'slideRight', size: 'xlarge', duration: 400 }
              ]}
            >
              {['First', 'Second', 'Third'].map(name => (
                <Button key={name} href='#' hoverIndicator>
                  <Box pad={{ horizontal: 'medium', vertical: 'small' }}>
                    <Text>{name}</Text>
                  </Box>
                </Button>
              ))}
            </Box>
          )}
          <Box gridArea='main' justify='center' align='center'>
                <Text>Main</Text>
          </Box>
        </Grid>
      </Grommet>
    )
  }
}

export default Home
