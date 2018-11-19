// This file is used for manual configuration of the Amplify library.
// When Amplify is used in conjunction with the Amplify CLI toolchain or AWS Mobile Hub to manage backend resources,
// an aws-exports.js file is auto-generated and can be used instead of the below to automatically configure the Amplify library.
// In this workshop, we are using the Amplify client libraries without the CLI toolchain so you should edit this file manually.

const awsConfig = {
    Auth: {
        identityPoolId: 'us-east-1:300313f1-26d8-4466-b6dc-96fa2ea98c56', // 'us-east-1:5109bd6b-38ab-4429-89f8-e74d93656224'
        region: 'us-east-1', // 'us-east-1'
        userPoolId: 'us-east-1_RhMplxFxs', // 'us-east-1_bgZVERFot'
        userPoolWebClientId: '6ss6vr6q54se8250u9qq388fej', // '4lu058ri9ntkfrv99aa2taeu01'
    },
    API: {
        endpoints: [
            {
                name: 'WildRydesAPI',
                endpoint: 'https://o6np07cnd2.execute-api.us-east-1.amazonaws.com/prod' // https://1ngrgqjt6c.execute-api.us-east-1.amazonaws.com/prod
            }
        ]
    },
    Storage: {
        bucket: 'wildrydesapi-profilepicturesbucket-ke6y8rzor6rr', //Amazon S3 bucket 'wildrydes-profile-images'
        region: 'us-east-1', // 'us-east-1'
    }
}

export default awsConfig;