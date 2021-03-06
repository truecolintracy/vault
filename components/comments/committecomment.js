import gql from 'graphql-tag';
import { Box, Form, Select, Button, FormField, TextArea, Text } from 'grommet';
import { Mutation } from 'react-apollo';

import Authentication from '../../lib/auth/msal-auth';

import { 
    committeeReviewNotificationToUser,
    committeeReviewNotificationToSupervisor,
    committeeReviewNotificationToLead
} from '../../lib/notifications';

const ADD_COMMITTEE_APPROVAL = gql`
    mutation addSubmissionCommitteeApproval(
        $submissionId: Int!
        $progress: Int!
        $approval: Int!
        $lead: String
        $content: String!
        $commentType: Int!
        $reward: Int
    ) {
        addSubmissionCommitteeApproval(
            submissionId: $submissionId
            progress: $progress
            approval: $approval
            lead: $lead
            content: $content
            commentType: $commentType
            reward: $reward
        ) {
            approval {
                id
                name
            }
        }
    }
`;

const emailNotifications = async (message) => {
    const auth = new Authentication();
    
    try {
        const token = await auth.getToken();
        const sendEmail = await auth.sendEmail(token, message);
        
        return sendEmail
    } catch (err) {
        console.log(err);
    }
}

const CommitteeComment = (props) => {
    const [approvalValue, setApprovalValue] = React.useState('');
    const [leadValue, setLeadValue] = React.useState('');
    const [commentValue, setCommentValue] = React.useState(undefined);
    const { 
        user,
        submissionId,
        committeeApproval,
        title, 
        commentType,
        supervisorEmail,
        users
    } = props
    const currentReward = approvalValue.id === 2 ? 2 : 4;

    const userMessage = committeeReviewNotificationToUser(user, submissionId);
    const supervisorMessage = committeeReviewNotificationToSupervisor(supervisorEmail, submissionId);
    const leadMessage = committeeReviewNotificationToLead(leadValue.userPrincipalName);
    let currentProgress;
    
    if (approvalValue.id === 2) {
        currentProgress = 9
    } else if (leadValue != null) {
           currentProgress = 6        
    } else {
        currentProgress = 5
    }
    
    return (
        <Mutation 
            mutation={ADD_COMMITTEE_APPROVAL}
            onCompleted={
                () => {
                    emailNotifications(userMessage).then(() => (
                        emailNotifications(supervisorMessage).then(() => (
                            emailNotifications(leadMessage).then(() => (
                                window.location.reload()
                            ))
                        ))
                    ))
                }
            }
            
        >
            {(addSubmissionCommitteeApproval, {data, error}) => (
                <Box>
                    <Form
                        onSubmit={e => {
                            e.preventDefault();
                            addSubmissionCommitteeApproval({ variables: { 
                                submissionId: submissionId,
                                progress: currentProgress,
                                approval: approvalValue.id,
                                lead: leadValue ? leadValue.id : null,
                                content: commentValue,
                                commentType: commentType,                         
                                reward: currentReward
                            } });
                        }}
                    >
                        <Box
                            background='white'
                            pad='10px'
                            margin={{ bottom: '15px' }}
                            style={{ borderBottom: '1px solid gray' }}
                        >
                            <Text>{title}</Text>
                        </Box>
                        {error && <Box margin={{ left: '15px' }}><Text color='red' size='15px'>Error :( All fields are required.</Text></Box>}                        
                        <Box
                            justify='start'
                            pad={{ left: '15px' }}
                            margin={{ bottom: '15px' }}
                        >
                            <FormField
                                label={<div style={{ fontSize: '14px', color: 'black', marginLeft: '-15px' }}>Choose the fate of this suggestion:<sup style={{ color: 'red' }}>*</sup></div>}
                                htmlFor='suggestionSelect'
                                {...props}
                            >
                                <Select 
                                    id='suggestionSelect'
                                    labelKey='name'
                                    valueKey='id'
                                    options={committeeApproval}
                                    value={approvalValue}
                                    placeholder='Approve or Deny'
                                    alignSelf='start'
                                    size='small'
                                    plain={true}
                                    style={{ 
                                        textAlign: 'left',
                                        padding: '11px 0',
                                        color: 'black',
                                    }}
                                    onChange={({ option }) => setApprovalValue(option)}
                                />
                            </FormField>
                        </Box>
                        <Box
                            justify='start'
                            pad={{ left: '15px' }}
                            margin={{ bottom: '15px' }}
                        >
                            <FormField
                                label={<div style={{ fontSize: '14px', color: 'black', marginLeft: '-15px', marginBottom: '10px' }}>Please Choose a Lead:<sup style={{ color: 'red' }}>*</sup></div>}
                                htmlFor='leadSelect'
                                {...props}
                            >
                                <Select 
                                    id='leadSelect'
                                    labelKey='displayName'
                                    valueKey='id'
                                    options={users}
                                    value={leadValue}
                                    placeholder='Choose Lead'
                                    alignSelf='start'
                                    size='small'
                                    plain={true}
                                    style={{ textAlign: 'left', padding: '11px 0', color: 'black' }}
                                    onChange={({ option }) => setLeadValue(option)}
                                />
                            </FormField>
                        </Box>
                        <Box pad={{ horizontal: '15px', bottom: '15px' }}>
                            <FormField
                                label={<div style={{ fontSize: '14px', color: 'black', marginLeft: '-15px', marginBottom: '10px' }}>Please Add a Comment:<sup style={{ color: 'red' }}>*</sup></div>}
                                htmlFor='text-area'
                                {...props}
                            >
                                <TextArea 
                                    id='text-area'
                                    placeholder='Your comments will be seen by the employee who submitted the suggestion as well as the team lead and supervisor.'
                                    value={commentValue}
                                    onChange={event => setCommentValue(event.target.value)}
                                    style={{ color: 'black' }}
                                />
                            </FormField>
                        </Box>
                        <Box pad={{ bottom: '15px' }}>
                            <Button 
                                type='submit'
                                label='Submit' 
                                primary
                                style={{
                                    background: '#D0011B',
                                    maxWidth: '250px',
                                    color: 'white',
                                    margin: '0 15px 0 auto'
                                }}
                            />
                        </Box>
                    </Form>
                </Box>
            )}
        </Mutation>
    )
}

export default CommitteeComment