import { Component } from "react"
import { ApolloConsumer } from "react-apollo"
import { withRouter } from "next/router"

import Main from "../../../lib/layout/main"
import { Box, Tabs, Tab } from "grommet"
import Card from "../../../components/card"

import NewSubmissions from "../../../components/submissions/teams/new"
import CompletedSubmissions from "../../../components/submissions/teams/complete"
import ActiveSubmissions from "../../../components/submissions/teams/active"

class PreviousSubmissions extends Component {
    render() {
        const { router, user, supervisorAuth, leadAuth } = this.props
        const currentUser = user.me.user
        
        return (
            <ApolloConsumer>
                {client => (
                    <Main supervisor={supervisorAuth} lead={leadAuth}>
                        <Card title="Your Team Submissions" tabs={true}>
                            <Tabs 
                                flex={true}
                                fill={true}
                                justify="start"
                            >
                                <Tab title="New">
                                    <Box 
                                        pad={{ vertical: "25px", horizontal: "15px" }}
                                        justify="center"
                                        alignContent="center"
                                        align="center"
                                    >   
                                        <NewSubmissions route={router.route} userId={currentUser.id} />
                                    </Box>
                                </Tab>
                                <Tab title="Active">
                                    <Box pad={{ vertical: "25px", horizontal: "15px" }}>
                                        <ActiveSubmissions route={router.route} userId={currentUser.id} />
                                    </Box>
                                </Tab>
                                <Tab title="Complete">
                                    <Box 
                                        pad={{ vertical: "25px", horizontal: "15px" }}
                                        justify="center"
                                        alignContent="center"
                                        align="center"
                                    >
                                        <CompletedSubmissions route={router.route} userId={currentUser.id} />
                                    </Box>
                                </Tab>
                            </Tabs>
                        </Card>

                    </Main>
                )}
            </ApolloConsumer>
        )
    }
}

export default withRouter(PreviousSubmissions)