import React, { Component } from "react"
import { ApolloConsumer } from "react-apollo"
import { withRouter } from "next/router"
import Link from "next/link"
import { Button } from "grommet"
import { Query } from "react-apollo";
import gql from "graphql-tag"

import Authorization from "../../../lib/auth/msal-auth"
import { getUserSupervisor } from "../../../lib/auth/msal-graph"

import Main from "../../../lib/layout/main"
import Card from "../../../components/card"

const GET_SUBMISSION_BY_ID = gql`
  query addSubmission($id: Int!) {
    fetchSubmission(id: $id) {
      id
    }
  }
`

class SubmissionSuccess extends Component {    
    state = {
        supervisor: "No Supervisor",
    }

    async componentWillMount() {
        try {
            const supervisor = await this.getSupervisor()
            this.setState({
                supervisor: supervisor.supervisor.id
            })
        } catch (err) {
            console.log(err)
        }
    }

    async getSupervisor() {
        const auth = new Authorization()

        try {
            const token = await auth.getToken()
            const supervisor = await getUserSupervisor(token)

            return supervisor
        } catch(err) {
            console.log(err)
        }
    }
      
    render() {
        const { router, supervisorAuth, leadAuth } = this.props
        const { supervisor } = this.state
        const id = parseInt(router.query.id)
        return (
            <ApolloConsumer>
                {client => (
                    <Query query={GET_SUBMISSION_BY_ID} variables={{ id }}>
                        {({ loading, error, data }) => {
                            if (loading) return null;
                            if (error) return `Something went wrong, please contact IT: ${error}`;
                
                            return (
                                <Main supervisor={supervisorAuth} lead={leadAuth}>
                                    <Card title="Thank You" highlight={true}>
                                        <p><strong>Submission #{id}</strong></p>
                                        <p style={{ fontSize: "14px" }}>
                                            Thank you! Thank you for making Progress Manufacturing a better place to work! Our team of improvement experts will review your suggestion and let you know the conclusion.<br/><br/>
                                            If it's approved we'll move forward with it and you'll be handsomely rewarded!<br/><br/>
                                            If it's not approved you will be immediately for suggesting such a foolish idea. I really hope you didn't suggest getting another candy in the breakroom. You really should have read the welcome message about how Hitler liked candy. I have pity on your soul.<br/><br/>
                                            Thanks again for participating in this wonderful program! You can see the progress of your other submissions in the side menu or you can even submit another improvement suggestion, maybe this time don't make it about candy.
                                        </p>
                                        <ul className="ButtonList">
                                            <li>
                                                <Link href="/ci/submit-improvement" passHref>
                                                    <Button
                                                        className="SimpleButton"
                                                        label="Submit Another Continual Improvement"
                                                        pad="20px"
                                                    />
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/ci/my-submissions" passHref>
                                                    <Button
                                                        className="SimpleButtonSecondary"
                                                        label="Check Status Of A Continual Improvement"
                                                        pad="20px"
                                                    />
                                                </Link>
                                            </li>
                                        </ul>
                                    </Card>
                                    <style jsx>{`
                                        .SubmissionForm {
                                            width: 100%;
                                        }
                                        sup {
                                            color: red;
                                            font-size: 12px;
                                        }
                                        ul.ButtonList {
                                            margin: 15px 0;
                                            padding: 0;
                                        }
                                        ul.ButtonList li {
                                            list-style-type: none;
                                            display: inline-block;
                                            margin-right: 25px
                                        }
                                    `}</style>
                                </Main>            
                            )
                        }}
                    </Query>
                )}
            </ApolloConsumer>
        )
    }
}

export default withRouter(SubmissionSuccess)