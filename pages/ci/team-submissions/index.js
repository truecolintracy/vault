import { Component } from "react"
import { ApolloConsumer } from "react-apollo"
import { withRouter } from "next/router"

import Main from "../../../lib/layout/main"
import { Box, Text, Tabs, Tab } from "grommet"
import Card from "../../../components/card"

import NewSubmissions from "../../../components/submissions/supervisor/new"
import InProgressSubmissions from "../../../components/submissions/supervisor/inprogress"
import ActiveSubmissions from "../../../components/submissions/supervisor/active"
import CompletedSubmissions from "../../../components/submissions/supervisor/complete"
import ArchivedSubmissions from "../../../components/submissions/supervisor/archived"

class PreviousSubmissions extends Component {
    render() {
        const { router, user, isSupervisor, isLead, isAdmin } = this.props

        return (
            <ApolloConsumer>
                {client => (
                    <Main isSupervisor={isSupervisor} isLead={isLead} isAdmin={isAdmin}>
                        <Card title="Your Departments Submissions" tabs={true}>
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
                                        <NewSubmissions route={router.route} userId={user.id} />
                                    </Box>
                                </Tab>
                                <Tab title="In Progress">
                                    <Box pad={{ vertical: "25px", horizontal: "15px" }}>
                                        <InProgressSubmissions route={router.route} userId={user.id} />
                                    </Box>
                                </Tab>
                                <Tab title="Active">
                                    <Box pad={{ vertical: "25px", horizontal: "15px" }}>
                                        <ActiveSubmissions route={router.route} userId={user.id} />
                                    </Box>
                                </Tab>
                                <Tab title="Complete">
                                    <Box 
                                        pad={{ vertical: "25px", horizontal: "15px" }}
                                        justify="center"
                                        alignContent="center"
                                        align="center"
                                    >
                                        <CompletedSubmissions route={router.route} userId={user.id} />
                                    </Box>
                                </Tab>
                                <Tab title="Archived">
                                    <Box 
                                        pad={{ vertical: "25px", horizontal: "15px" }}
                                        justify="center"
                                        alignContent="center"
                                        align="center"
                                    >
                                        <ArchivedSubmissions route={router.route} userId={user.id} />
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
